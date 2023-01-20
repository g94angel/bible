// adds findVerse func to main-search-btn
$('.main-search-btn').click(findVerse);

$('.verse-ref-input').on('keypress', (e) => {
  if (e.key === 'Enter') {
    findVerse();
  }
});
const placeholderText =
  'Start typing verse references to display verse text. (i.e. Gen 1:26, Col 3:4)';

$('input').attr('placeholder', placeholderText);

// toggle
$('.toggle-btn').click(() => {
  $('.toggle-btn').toggleClass('toggled');
  $('body').toggleClass('dark');
  $('input').toggleClass('dark');
  $('.copyright').toggleClass('dark');
});

// this function clears the screen
function reset() {
  // clears out previous verses
  $('.verses').empty();
  // clears input
  $('.verse-ref-input').val('');
  // removes warning
  $('.warning').text('').hide();
}

// creating cache to store previous searches so don't have fetch data
const loggedSearches = {};
console.log('stored log', loggedSearches);

function logSearches(search) {
  console.log('logging search', search);
  // if (loggedSearches[search]) return;
  // else loggedSearches[search] = search;

  $('#previous-searches').append(`
      <div class="ref-container">
        <p class="reference">
          ${search}
        </p>
        <button class="btn search-btn" id="${search}">
          Search
        </button>
      </div>
    `);
  // // $('.reference').text(search);
  // PROBLEM IS HERE
  $('.search-btn').on('click', function () {
    fetchData(this.id);
    // console.log(this.id);
  });

  $('.previous-container').show();
}

function findVerse() {
  const reference = $('.verse-ref-input').val();
  if (reference.length === 0) {
    console.log('nothing inputted');
    return;
  } else {
    console.log(reference);
    fetchData(reference);
  }
}

function fetchData(ref) {
  // if reference is in cache - has been searched before
  if (loggedSearches[ref]) {
    console.log('inside stored log', loggedSearches[ref]);
    const data = loggedSearches[ref];
    reset();
    // no need to add searches to container since they have been appended already
    // logSearches(ref);

    // everything below works
    $('.copyright').text(data.copyright);
    if (data.verses.length > 1) {
      if (data.message) {
        $('.warning').text(data.message.slice(7)).show();
      }
      for (let i = 0; i < data.verses.length; i++) {
        const ref = data.verses[i].ref;
        const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
        const message = `<strong>${ref}</strong> - ${text}`;

        $('.verses').append(`<p>${message}</p>`);
      }
    } else {
      const ref = data.verses[0].ref;
      const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
      const message = `<strong>${ref}</strong> - ${text}`;
      $('.verses').append(`<p>${message}</p>`);
    }
  } // if reference is not in cache - has never been searched
  else {
    console.log('not inside stored log', loggedSearches);
    fetch(`https://api.lsm.org/recver.php?String=${ref}&Out=json`)
      .then((res) => res.json())
      .then((data) => {
        console.log('this is the data from the server', data);
        reset();

        loggedSearches[ref] = data;
        console.log('new search', loggedSearches);
        // return;

        // everything below works
        $('.copyright').text(data.copyright);
        // console.log('data verses ', data.verses);
        if (data.verses.length > 1) {
          console.log(data.verses.length);
          if (data.message) {
            // if there are more than 30 verses in request
            $('.warning').text(data.message.slice(7)).show();
          }
          for (let i = 0; i < data.verses.length; i++) {
            const ref = data.verses[i].ref;
            const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
            const message = `<strong>${ref}</strong> - ${text}`;

            $('.verses').append(`<p>${message}</p>`);
          }
        } else {
          console.log(data.verses.length);
          const ref = data.verses[0].ref;
          const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
          const message = `<strong>${ref}</strong> - ${text}`;
          $('.verses').append(`<p>${message}</p>`);
        }
        // PROBLEM IS HERE
        logSearches(ref.trim());
      })
      .catch((err) => console.log(err));
  }
}
