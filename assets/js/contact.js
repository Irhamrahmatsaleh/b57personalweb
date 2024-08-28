function submitForm(event) {
  event.preventDefault(); // Mencegah form dari pengiriman default

  const inputName = document.getElementById("name").value;
  const inputEmail = document.getElementById("email").value;
  const inputPhone = document.getElementById("phone").value;
  const selectSubject = document.getElementById("subject").value;
  const inputMessage = document.getElementById("message").value;

  // Validasi input
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

  // Konfirmasi data
  const isConfirmed = confirm("Is your data correct?");

  if (isConfirmed) {
    // Membuat objek contact untuk menyimpan data
    const contact = {
      name: inputName,
      email: inputEmail,
      phoneNumber: inputPhone,
      subject: selectSubject,
      message: inputMessage,
    };

    // Tampilkan objek contact di console
    console.log(contact);

    // Mengirim data via email
    const link = document.createElement("a");
    link.href = `mailto:irhamrahmatsaleh1997@gmail.com?subject=${encodeURIComponent(selectSubject)}&body=Hello, my name is ${encodeURIComponent(inputName)}.%0D%0A%0D%0APhone Number: ${encodeURIComponent(inputPhone)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(inputMessage)}`;
    link.click();

    alert("Your data has been submitted.");
  } else {
    // Jika Cancel, biarkan pengguna memperbaiki data
    alert("Please correct your data.");
  }
}
