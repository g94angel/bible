function reset() {
  $('.verses').empty();
  $('.verse-ref-input').val('');
  $('.warning').text('').hide();
}

let previousVisible = false;

function logSearches(reference) {
  $('.previous').append(
    `
      <div class="ref-container">
        <p class="reference">
          ${reference}
        </p>
        <button class="btn save-btn" id="${reference}">
          Save search
        </button>
      </div>
    `
  );
  $('.save-btn').click(function () {
    console.log('saving', reference);
    // localStorage.setItem('test', this.id);
    $('.saved').append(
      `
        <div class="ref-container">
          <p class="reference">
            ${reference}
          </p>
          <button class="btn search-verses-btn" id="${reference}">
            Search verses
          </button>
        </div>
      `
    );
    $('.search-verses-btn').click(function () {
      // console.log(this.id);
      console.log('searching for verses');
      console.log(this.id);
      findVerse(this.id);
    });
    if ($('.saved').is(':hidden')) {
      $('.saved').show();
    }
  });
  if ($('.previous').is(':hidden')) {
    console.log('previous is hidden, will show now');
    $('.previous').show();
  }
}

function findVerse(input) {
  // console.log('going to find a verse');
  console.log('this is the input', input);
  const ref = $('.verse-ref-input').val();
  console.log('this is reference', ref);

  // if (!ref || input) return;
  const answer = input || ref;
  console.log('answer', answer);
  if (!answer) return;
  fetchData(answer);
}

function fetchData(reference) {
  fetch(`https://api.lsm.org/recver.php?String=${reference}&Out=json`)
    .then((res) => res.json())
    .then((data) => {
      reset();
      logSearches(reference);
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

$('.search-btn').click(findVerse);
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

$('.clear-btn').click(function () {
  console.log('clearing storage');
  // localStorage.clear();
});
