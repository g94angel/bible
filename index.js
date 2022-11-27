function reset() {
  $('.verses').empty();
  $('.verse-ref-input').val('');
  $('.warning').text('').hide();
}

function findVerse() {
  const reference = $('.verse-ref-input').val();
  if (!reference) return;
  fetch(`https://api.lsm.org/recver.php?String=${reference}&Out=json`)
    .then((res) => res.json())
    .then((data) => {
      reset();
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
