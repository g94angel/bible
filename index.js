import { main } from './openai';

// creating cache to store previous searches so don't have fetch data, optimized results
const loggedSearches = {};

// adds findVerse func to primary button
$('.primary-btn').click(findVerse);
// adds askChatGPT func to secondary button
$('.secondary-btn').click(askChatGPT);

const placeholderText = 'Search for verses (i.e. Gen 1:26, Col 3)';
const secondPlaceholderText = 'Ask a question (i.e. What is Revelation about?)';

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
  // clicking on the view button causes the code to run multiple times
  // console.log('inside display previous searches', searchData);
  if (displayed === false) {
    $('.previous-searches-container').append(`
    <div class="container">
      <p class="bold">${searchData}</p>
      <button
        class="btn search-btn"
        id="${searchData}"
      >
        View
      </button>
    </div>`);
    $('.search-btn').on('click', function () {
      retrieveAndDisplayData(this.id);
    });
    $('.previous-searches-container').show();
  }
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
        const message = `<p class='verse-text'><span class='bold'>${ref}</span> - ${text} </p>`;
        $('.search-results').append(message);
        $('.verse-text').click((e) => addToClipboard(e));
      }
      // if one verse
    } else if (data.verses.length === 1) {
      const ref = data.verses[0].ref;
      const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
      const message = `
          <p class='verse-text'><span class='bold'>${ref}</span> - ${text}</p>`;
      $('.search-results').append(message);
      $('.verse-text').click((e) => addToClipboard(e));
    }
  }
  // if gpt search
  else if (typeof data === 'string') {
    const question = `<h3 class='question-text'>${searchData}</h3>`;
    const message = `<p class='answer-text'>${data}</p>`;
    $('.search-results').append(question, message);
    $('.answer-text').click((e) => addToClipboard(e));
  }
  displayPreviousSearches(searchData, true);
}

function findVerse() {
  // $('.search-results-area').focus();
  const searchData = $('.verse-input').val();
  if (searchData.length === 0) {
    return;
  } else {
    if (loggedSearches[searchData]) {
      retrieveAndDisplayData(searchData);
    } else {
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
    retrieveAndDisplayData(userQuestion);
  } else {
    reset();
    // const question = `<p class='question-text'>${searchData}</p>`;
    // const message = `<p class='answer-text'>${data}</p>`;
    // $('.search-results').append(question, message);
    // $('.answer-text').click((e) => addToClipboard(e));
    const question = `<p class='question-text'>${userQuestion}</p>`;
    const response = await main(userQuestion);
    loggedSearches[userQuestion] = response;
    const message = `<p class='answer-text'>${response}</p>`;
    $('.search-results').append(question, message);
    $('.answer-text').click((e) => addToClipboard(e));
    $('.loader').attr('hidden', true);
    $('.copy-msg').show();

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

        loggedSearches[searchData] = data;

        if (data.verses.length === 1) {
          const ref = data.verses[0].ref;
          const text = data.verses[0].text.replace(/[\[\]/;]+/g, '');
          const message = `
            <p class='verse-text'><span class='bold'>${ref}</span> - ${text}</p>`;
          $('.search-results').append(`<p>${message}</p>`);
          $('.verse-text').click((e) => addToClipboard(e));

          // if there are more than 30 verses
        } else if (data.verses.length > 1) {
          // if there is a warning message
          if (data.message) {
            $('.warning').text(data.message.slice(7)).show();
          }
          for (let i = 0; i < data.verses.length; i++) {
            const ref = data.verses[i].ref;
            const text = data.verses[i].text.replace(/[\[\]/;]+/g, '');
            const message = `
              <p class='verse-text'><span class='bold'>${ref}</span> - ${text}</p>`;
            $('.search-results').append(message);
            $('.verse-text').click((e) => addToClipboard(e));
          }
        }
      }
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
