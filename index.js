import { main } from './ai';

// creating cache to store previous searches so don't have fetch data, optimized results
const loggedSearches = {};

// adds findVerse func to primary button
$('.primary').click(findVerse);
// adds askChatGPT func to secondary button
$('.secondary').click(askChatGPT);

const placeholderText = 'Search for verses (i.e. Gen 1:26, Col 3:4)';
const secondPlaceholderText = 'Where does the Bible talk about ...';

$('input').attr('placeholder', placeholderText);
$('.question-input').attr('placeholder', secondPlaceholderText);

$('.question-input').on('keypress', (e) => {
  if (e.key === 'Enter') {
    askChatGPT();
  }
});

$('.verse-input').on('keypress', (e) => {
  if (e.key === 'Enter') {
    findVerse();
  }
});

$('.copyright').text(
  `Holy Bible Recovery Version © ${new Date().getFullYear()} Living Stream Ministry`
);

// toggle
$('.toggle-btn').click(() => {
  $('.toggle-btn').toggleClass('toggled');
  $('body').toggleClass('dark');
  $('input').toggleClass('dark');
});

// this function clears the search-results-area
function reset() {
  // clears out previous searches
  $('.search-results').empty();
  // clears inputs
  $('.verse-input').val('');
  $('.question-input').val('');
  // displays spinner
  $('.loader').removeAttr('hidden');
  // removes warning
  $('.warning').text('').hide();
  // hides message about copying text by clicking
  $('.copy-msg').hide();
  // hides invalid reference message
  $('.does-not-exist').hide();
}

function clearPreviousSearches() {
  // clears out previous searches
  $('.search-results').empty();
}

function displayPreviousSearches(search) {
  $('#previous-searches').append(`
      <div class="container">
        <p class="bold">
          ${search}
        </p>
        <button class="btn search-btn" id="${search}">
          View
        </button>
      </div>
    `);

  $('.search-btn').on('click', function () {
    retrieveAndDisplayData(this.id);
  });

  $('.previous-searches-container').show();
}

function retrieveAndDisplayData(searchData) {
  const data = loggedSearches[searchData];
  console.log('data', data);
  clearPreviousSearches();
  $('.copy-msg').show();
  // if verse search
  if (data.copyright) {
    // if more than one verse
    if (data.verses.length > 1) {
      if (data.message) {
        $('.warning').text(data.message.slice(7)).show();
      }
      for (let i = 0; i < data.verses.length; i++) {
        const ref = data.verses[i].ref;
        const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
        const message = `<p class='text'><span class='bold'>${ref}</span> - ${text} </p>`;
        $('.search-results').append(message);
        $('.text').click((e) => addToClipboard(e));
      }
      // if one verse
    } else if (data.verses.length === 1) {
      const ref = data.verses[0].ref;
      const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
      const message = `
          <p class='text'><span class='bold'>${ref}</span> - ${text}</p>`;
      $('.search-results').append(message);
      $('.text').click((e) => addToClipboard(e));
    }
  }
  // if gpt
  else {
    const message = `<p class='text'>${data}</p>`;
    $('.search-results').append(message);
    $('.text').click((e) => addToClipboard(e));
  }
  console.log('finished executing');
}

function checkLog(searchData) {
  // if reference is in cache - has been searched before
  // $('.titles').empty();
  if (loggedSearches[searchData]) {
    return true;
  } else return false;
}

function findVerse() {
  // $('.search-results-area').focus();
  const searchData = $('.verse-input').val();

  if (searchData.length === 0) {
    return;
  } else {
    if (checkLog(searchData) === true) {
      console.log('checking log', checkLog(searchData));
      retrieveAndDisplayData(searchData);
    } else {
      fetchData(searchData);
    }
  }
}

async function askChatGPT() {
  $('.search-results').empty();
  const userQuestion = $('.question-input').val();
  const slicedUserQuestion = userQuestion.slice(0, 50) + '...';
  // checkLog(userQuestion);
  if (userQuestion.length === 0) {
    return;
  } else {
    const question = `<p class='text'>${userQuestion}</p>`;
    $('.search-results').append(question);
    reset();
    const response = await main(userQuestion);
    loggedSearches[slicedUserQuestion] = response;
    const message = `<p class='answer-text'>${response}</p>`;
    $('.search-results').append(message);
    $('.loader').attr('hidden', true);
  }
  displayPreviousSearches(slicedUserQuestion);
}

function fetchData(searchData) {
  reset();
  fetch(`https://api.lsm.org/recver.php?String=${searchData}&Out=json`)
    .then((res) => res.json())
    .then((data) => {
      $('.loader').attr('hidden', true);
      $('.copy-msg').show();
      loggedSearches[searchData] = data;
      // if there is one verse
      if (data.verses.length === 1) {
        const ref = data.verses[0].ref;
        const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
        const message = `
            <p class='text'><span class='bold'>${ref}</span> - ${text}</p>`;
        $('.search-results').append(`<p>${message}</p>`);
        $('.text').click((e) => addToClipboard(e));

        // if there are more than 30 verses
      } else if (data.verses.length > 1) {
        // if there is a warning message
        if (data.message) {
          console.log('message', data.message);
          $('.warning').text(data.message.slice(7)).show();
        }
        for (let i = 0; i < data.verses.length; i++) {
          const ref = data.verses[i].ref;
          const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
          const message = `
              <p class='text'><span class='bold'>${ref}</span> - ${text}</p>`;
          $('.search-results').append(message);
          $('.text').click((e) => addToClipboard(e));
        }
      } else {
        // error handling
        if (data.verses[0].text.includes('No such')) {
          $('.copy-msg').hide();
          $('.does-not-exist')
            .show()
            .text(`${data.inputstring} is an invalid reference. Try again.`);
          setTimeout(() => {
            $('.does-not-exist').hide().text('');
          }, 2000);
          return;
        }
      }
      displayPreviousSearches(searchData);
    })
    .catch((err) => console.log(err));
}

function addToClipboard(event) {
  navigator.clipboard.writeText(event.target.outerText);
  $(event.target).addClass('copied');
  setTimeout(() => {
    $(event.target).removeClass('copied');
  }, 100);
}
