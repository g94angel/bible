function reset() {
  $('.verses').empty();
  $('.verse-ref-input').val('');
  $('.warning').text('').hide();
}

// creating cache to store previous searches so don't have fetch data
const loggedSearches = {};

function logSearches(search) {
  if (loggedSearches[search]) return;
  else loggedSearches[search] = search;

  $('.searches-title').append(`
      <div class="ref-container">
        <p class="reference">
          ${search}
        </p>
        <button class="btn search-btn" id="${search}">
          Search
        </button>
      </div>
    `);
  $('button').on('click', $(`#${search}`), function () {
    fetchData(this.id);
  });

  $('.previous-container').show();
}

function findVerse() {
  const reference = $('.verse-ref-input').val();
  if (reference.length === 0) return;
  fetchData(reference);
}

function fetchData(ref) {
  fetch(`https://api.lsm.org/recver.php?String=${ref}&Out=json`)
    .then((res) => res.json())
    .then((data) => {
      reset();
      logSearches(ref);

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
    })
    .catch((err) => console.log(err));
}

// everything below works

$('.main-search-btn').on('click', findVerse);

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
