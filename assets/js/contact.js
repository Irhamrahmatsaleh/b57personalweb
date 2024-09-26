function submitForm(event) {
  event.preventDefault();

  const inputName = document.getElementById("name").value;
  const inputEmail = document.getElementById("email").value;
  const inputPhone = document.getElementById("phone").value;
  const selectSubject = document.getElementById("subject").value;
  const inputMessage = document.getElementById("message").value;

  if (!inputName.length) {
    return alert("Name cannot be empty");
  } else if (!inputEmail.length) {
    return alert("Email cannot be empty");
  } else if (!inputPhone.length) {
    return alert("Phone number cannot be empty");
  } else if (!selectSubject.length) {
    return alert("Subject cannot be empty");
  } else if (!inputMessage.length) {
    return alert("Message cannot be empty");
  }

  const isConfirmed = confirm("Is your data correct?");

  if (isConfirmed) {
    const contact = {
      name: inputName,
      email: inputEmail,
      phoneNumber: inputPhone,
      subject: selectSubject,
      message: inputMessage,
    };

    console.log(contact);

    const link = document.createElement("a");
    link.href = `mailto:irhamrahmatsaleh1997@gmail.com?subject=${encodeURIComponent(selectSubject)}&body=Hello, my name is ${encodeURIComponent(inputName)}.%0D%0A%0D%0APhone Number: ${encodeURIComponent(inputPhone)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(inputMessage)}`;
    link.click();

    alert("Your data has been submitted.");
  } else {
    alert("Please correct your data.");
  }
}
