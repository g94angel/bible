function findVerse() {
  const reference = $('.verse-ref-input').val();
  if (!reference) return;
  fetch(`https://api.lsm.org/recver.php?String=${reference}&Out=json`)
    .then((res) => res.json())
    .then((data) => {
      $('.verses').empty();
      $('.verse-ref-input').val('');
      if (data.verses.length > 1) {
        console.log(data.verses);
        $('.subheader').text('Only 30 verses can be displayed at a time.');
        for (let i = 0; i < data.verses.length; i++) {
          const ref = data.verses[i].ref;
          const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
          const message = `${ref} - ${text}`;

          $('.verses').append(`<p>${message}</p>`);
        }
      } else {
        const ref = data.verses[0].ref;
        const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
        const message = `${ref} - ${text}`;
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
