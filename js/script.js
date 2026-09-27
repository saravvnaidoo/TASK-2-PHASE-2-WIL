// Shared page interactions stay in one file so every screen can use the same script safely.

// If the supplied logo cannot load, show a text identity instead of a broken-image icon.
var logoImages = document.querySelectorAll('.brand-logo, .footer-logo');
for (var imageIndex = 0; imageIndex < logoImages.length; imageIndex++) {
  logoImages[imageIndex].addEventListener('error', function () {
    this.hidden = true;
    var fallback = this.parentElement.querySelector('.brand-fallback');
    if (fallback) {
      fallback.hidden = false;
    }
  });
}

// Calculator rates are listed plainly to make the pricing rule easy to read and change.
var calculator = document.getElementById('fee-calculator');
if (calculator) {
  var packageType = document.getElementById('package-type');
  var durationInput = document.getElementById('duration');
  var peopleInput = document.getElementById('people');
  var totalOutput = document.getElementById('fee-total');
  var totalMessage = document.getElementById('fee-message');
  var feeError = document.getElementById('fee-error');

  function updateFeeTotal() {
    var hours = Number(durationInput.value);
    var people = Number(peopleInput.value);
    var hoursAreValid = Number.isInteger(hours) && hours >= 1 && hours <= 24;
    var peopleAreValid = Number.isInteger(people) && people >= 1 && people <= 12;

    // Never show a calculated amount until both inputs are inside the allowed ranges.
    if (!hoursAreValid || !peopleAreValid) {
      totalOutput.textContent = 'R --.--';
      totalMessage.textContent = 'Correct the highlighted values to see your estimate.';
      feeError.hidden = false;
      durationInput.setAttribute('aria-invalid', String(!hoursAreValid));
      peopleInput.setAttribute('aria-invalid', String(!peopleAreValid));
      return;
    }

    var hourlyRate = 45;
    if (packageType.value === 'console') {
      hourlyRate = 35;
    } else if (packageType.value === 'vip') {
      hourlyRate = 85;
    }

    var sessionTotal = hourlyRate * hours * people;
    totalOutput.textContent = 'R ' + sessionTotal.toFixed(2);
    totalMessage.textContent = 'For ' + people + (people === 1 ? ' person, ' : ' people, ') + hours + (hours === 1 ? ' hour.' : ' hours.');
    feeError.hidden = true;
    durationInput.setAttribute('aria-invalid', 'false');
    peopleInput.setAttribute('aria-invalid', 'false');
  }

  // Listening to both input and change covers typing as well as using the number stepper.
  calculator.addEventListener('input', updateFeeTotal);
  calculator.addEventListener('change', updateFeeTotal);
  updateFeeTotal();
}

// The contact form gives clear feedback locally; it does not pretend to send data to a server.
var contactForm = document.getElementById('contact-form');
if (contactForm) {
  var nameInput = document.getElementById('contact-name');
  var emailInput = document.getElementById('contact-email');
  var messageInput = document.getElementById('contact-message');
  var nameError = document.getElementById('name-error');
  var emailError = document.getElementById('email-error');
  var messageError = document.getElementById('message-error');
  var formSuccess = document.getElementById('form-success');

  function isEmailValid(email) {
    // A simple first-year-friendly pattern: non-space text, an @, then a dot in the domain.
    var basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return basicEmailPattern.test(email);
  }

  function showFieldError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', String(message !== ''));
    return message === '';
  }

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    formSuccess.hidden = true;

    var nameIsValid = showFieldError(nameInput, nameError, nameInput.value.trim().length >= 2 ? '' : 'Please enter at least 2 characters.');
    var emailIsValid = showFieldError(emailInput, emailError, isEmailValid(emailInput.value.trim()) ? '' : 'Enter an email address in a name@example.com format.');
    var messageIsValid = showFieldError(messageInput, messageError, messageInput.value.trim().length >= 10 ? '' : 'Please enter at least 10 characters.');

    if (nameIsValid && emailIsValid && messageIsValid) {
      formSuccess.hidden = false;
      contactForm.reset();
      nameInput.focus();
    }
  });

  // When someone edits a corrected field, remove only that field's old message.
  nameInput.addEventListener('input', function () {
    showFieldError(nameInput, nameError, nameInput.value.trim().length >= 2 ? '' : 'Please enter at least 2 characters.');
    formSuccess.hidden = true;
  });
  emailInput.addEventListener('input', function () {
    showFieldError(emailInput, emailError, isEmailValid(emailInput.value.trim()) ? '' : 'Enter an email address in a name@example.com format.');
    formSuccess.hidden = true;
  });
  messageInput.addEventListener('input', function () {
    showFieldError(messageInput, messageError, messageInput.value.trim().length >= 10 ? '' : 'Please enter at least 10 characters.');
    formSuccess.hidden = true;
  });
}
