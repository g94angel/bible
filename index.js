// const verseRefs = [
//   'rom9:20',
//   'rom10:9',
//   'rom10:10',
//   '2cor5:14',
//   'rom 14:8',
//   'rom 10:4',
//   'matt 11:28',
//   'john 6:37',
//   'matt 6:33',
//   'psalm 119:105',
//   'col 3:2',
//   'eph 4:32',
//   'colossians 3:23',
//   '2 tim 2:4',
//   'john 1:4',
//   'rev 22:12',
//   'luke 6:31',
//   'phil 4:4',
//   'luke 17:32',
// ];
// const randomNum = Math.floor(Math.random() * verseRefs.length);

function findVerse() {
  console.log('finding verse');
  // fetch(
  //   `https://api.lsm.org/recver.php?String=${$(
  //     '.verse-ref-input'
  //   ).val()}&Out=json`
  // )
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log(data);
  //     // const ref = data.verses[0].ref;
  //     // const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
  //     // const subheading = document.querySelector('h3');
  //     // subheading.innerText = `${text}`;
  //   })
  //   .catch((err) => console.log(err));
}

$('.search-btn').click(findVerse);
