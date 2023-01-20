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
});

// this function clears the screen
function reset() {
  // clears out previous verses
  $('.verses').empty();
  // clears input
  $('.verse-ref-input').val('');
  // removes warning
  $('.warning').text('').hide();
  // $('.copyright').hide();
  $('.copy-msg').hide();
}

// creating cache to store previous searches so don't have fetch data, optimized results
const loggedSearches = {};

function logSearches(search) {
  $('#previous-searches').append(`
      <div class="ref-container">
        <p class="bold">
          ${search}
        </p>
        <button class="btn search-btn" id="${search}">
          Search
        </button>
      </div>
    `);

  $('.search-btn').on('click', function () {
    fetchData(this.id);
  });

  $('.previous-searches-container').show();
}

function findVerse() {
  const reference = $('.verse-ref-input').val();
  if (reference.length === 0) {
    return;
  } else {
    fetchData(reference);
  }
}

function fetchData(ref) {
  // if reference is in cache - has been searched before
  if (loggedSearches[ref]) {
    const data = loggedSearches[ref];
    reset();
    $('.copy-msg').show();
    if (data.verses.length > 1) {
      if (data.message) {
        $('.warning').text(data.message.slice(7)).show();
      }
      for (let i = 0; i < data.verses.length; i++) {
        const ref = data.verses[i].ref;
        const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
        const message = `<p class='verse-text'><span class='bold'>${ref}</span> - ${text} </p>`;
        $('.verses').append(message);
      }
    } else {
      const ref = data.verses[0].ref;
      const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
      const message = `
        <p class='verse-text'><span class='bold'>${ref}</span> - ${text}</p>`;
      $('.verses').append(message);
    }
    $('.verse-text').click(function () {
      navigator.clipboard.writeText($(this).text().trim());
      $(this).addClass('copied');
      setTimeout(() => {
        $(this).removeClass('copied');
      }, 100);
    });
  } // if reference is not in cache - has never been searched
  else {
    fetch(`https://api.lsm.org/recver.php?String=${ref}&Out=json`)
      .then((res) => res.json())
      .then((data) => {
        reset();
        loggedSearches[ref] = data;
        $('.copy-msg').show();

        if (data.verses.length > 1) {
          if (data.message) {
            // if there are more than 30 verses in request
            $('.warning').text(data.message.slice(7)).show();
          }
          for (let i = 0; i < data.verses.length; i++) {
            const ref = data.verses[i].ref;
            const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
            const message = `
              <p class='verse-text'><span class='bold'>${ref}</span> - ${text}</p>`;
            $('.verses').append(message);
          }
          $('.verse-text').click(function () {
            navigator.clipboard.writeText($(this).text().trim());
            $(this).addClass('copied');
            setTimeout(() => {
              $(this).removeClass('copied');
            }, 100);
          });
        } else {
          // error handling
          if (
            data.verses[0].text === 'No such reference' ||
            data.verses[0].text.includes('No such chapter in')
          ) {
            $('.copy-msg').hide();
            $('.does-not-exist')
              .show()
              .text(`${data.inputstring} is not in the Bible.`);
            setTimeout(() => {
              $('.does-not-exist').hide().text('');
            }, 2000);
            return;
          }
          const ref = data.verses[0].ref;
          const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
          const message = `
            <p class='verse-text'><span class='bold'>${ref}</span> - ${text}</p>`;
          $('.verses').append(`<p>${message}</p>`);
          $('.verse-text').click(function () {
            navigator.clipboard.writeText($(this).text());
            $(this).addClass('copied');
            setTimeout(() => {
              $(this).removeClass('copied');
            }, 100);
          });
        }
        logSearches(ref.trim());
      })
      .catch((err) => console.log(err));
  }
}
