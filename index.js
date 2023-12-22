import { main } from './ai';

// creating cache to store previous searches so don't have fetch data, optimized results
const loggedSearches = {};

// adds findVerse func to primary button
$('.primary-btn').click(findVerse);
// adds askChatGPT func to secondary button
$('.secondary-btn').click(askChatGPT);

const placeholderText = 'Search for verses (i.e. Gen 1:26, Col 3:4)';
const secondPlaceholderText = 'Where does the Bible talk about ...';

$('input').attr('placeholder', placeholderText);
$('.question-input').attr('placeholder', secondPlaceholderText);

$('.verse-input').on('keypress', (e) => {
  if (e.key === 'Enter') {
    findVerse();
  }
});
$('.question-input').on('keypress', (e) => {
  if (e.key === 'Enter') {
    askChatGPT();
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
// ------------------------------------------

// this function clears the screen, use when making a request
function reset() {
  // clears out previous searches div
  $('.search-results').empty();
  // clears inputs
  $('.verse-input').val('');
  $('.question-input').val('');
  // displays spinner
  $('.loader').removeAttr('hidden');
  // removes warning text
  $('.warning').text('').hide();
  // hides message about copying text by clicking
  $('.copy-msg').hide();
  // hides invalid reference message
  $('.does-not-exist').hide();
}

// this function clears the screen, use when fetching from log
function clearPreviousSearchResults() {
  // clears out previous results
  $('.search-results').empty();
  // clears inputs
  $('.verse-input').val('');
  $('.question-input').val('');
}

function displayPreviousSearches(searchData, displayed) {
  console.log('inside display previous searches', searchData);
  if (displayed === true) {
    console.log('not adding');
    return;
  }
  $('#previous-searches').append(`
    <div class="container">
      <p class="bold">${searchData}</p>
      <button
        class="btn search-btn"
        id="${searchData}"
      >
        View
      </button>
    </div>`);
  // $('.text').click((e) => addToClipboard(e));
  $('.search-btn').click(function () {
    retrieveAndDisplayData(this.id);
  });

  $('.previous-searches-container').show();
}

function retrieveAndDisplayData(searchData) {
  const data = loggedSearches[searchData];
  clearPreviousSearchResults();
  $('.copy-msg').show();
  // if verse search
  if (typeof data === 'object') {
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
  // if gpt search
  else if (typeof data === 'string') {
    const message = `<p class='text'>${data}</p>`;
    $('.search-results').append(message);
    $('.text').click((e) => addToClipboard(e));
  }
  console.log('not adding to previous searches');
  displayPreviousSearches(searchData, true);
}

// function checkLog(searchData) {
//   // if reference is in cache - has been searched before
//   // $('.titles').empty();
//   if (loggedSearches[searchData]) {
//     return true;
//   } else return false;
// }

function findVerse() {
  // $('.search-results-area').focus();
  const searchData = $('.verse-input').val();
  if (searchData.length === 0) {
    return;
  } else {
    if (loggedSearches[searchData]) {
      console.log('found in log');
      retrieveAndDisplayData(searchData);
    } else {
      console.log('not in log, will make request');
      fetchData(searchData);
    }
  }
}

async function askChatGPT() {
  let userQuestion = $('.question-input').val();
  userQuestion =
    userQuestion.length > 50 ? userQuestion.slice(0, 50) + '...' : userQuestion;
  if (userQuestion.length === 0) {
    return;
  } else if (loggedSearches[userQuestion]) {
    console.log('found in log');
    retrieveAndDisplayData(userQuestion);
  } else {
    reset();
    const question = `<p class='text'>${userQuestion}</p>`;
    $('.search-results').append(question);
    const response = await main(userQuestion);
    loggedSearches[userQuestion] = response;
    const message = `<p class='answer-text'>${response}</p>`;
    $('.search-results').append(message);
    $('.loader').attr('hidden', true);
    console.log('adding to previous searches');
    displayPreviousSearches(userQuestion, false);
  }
}

function fetchData(searchData) {
  reset();
  fetch(`https://api.lsm.org/recver.php?String=${searchData}&Out=json`)
    .then((res) => res.json())
    .then((data) => {
      if (data.verses[0].text.includes('No such')) {
        $('.copy-msg').hide();
        $('.does-not-exist')
          .show()
          .text(`${data.inputstring} is an invalid reference. Try again.`);
        setTimeout(() => {
          $('.does-not-exist').hide().text('');
        }, 2000);
        return;
      } else {
        $('.loader').attr('hidden', true);
        $('.copy-msg').show();
        console.log('storing in log');
        loggedSearches[searchData] = data;

        if (data.verses.length === 1) {
          console.log('only one verse');
          const ref = data.verses[0].ref;
          const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
          const message = `
            <p class='text'><span class='bold'>${ref}</span> - ${text}</p>`;
          $('.search-results').append(`<p>${message}</p>`);
          $('.text').click((e) => addToClipboard(e));

          // if there are more than 30 verses
        } else if (data.verses.length > 1) {
          console.log('multiple verses');
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
        }
      }
      console.log('adding to previous searches');
      displayPreviousSearches(searchData, false);
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
