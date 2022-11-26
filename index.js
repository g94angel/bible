function findVerse() {
  const reference = $('.verse-ref-input').val();
  if (!reference) return;
  fetch(`https://api.lsm.org/recver.php?String=${reference}&Out=json`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      $('.verses').empty();
      $('.verse-ref-input').val('');
      $('.copyright').text(data.copyright);
      if (data.verses.length > 1) {
        if (data.verses.length >= 30) {
          console.log('verses length', data.verses.length);
          $('.subheader').text(data.message.slice(7));
        }
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
