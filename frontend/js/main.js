const form = document.querySelector('#form')
const uName = document.querySelector('#name')
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gender = formData.get('gender')
    const expectation = formData.get('expectation')
    const agree = formData.get('agree')


    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gender, expectation, agree })
        });
        if (response.ok) {
            alert(`You have succefully send me a secrit message`);
            form.reset()
        } else {
            alert('An error occured please refresh your page');
        }
    } catch (error) {
        console.error('Something went wrong', error.message);
    }
});

jQuery(document).ready(function ($) {
    /*====================================
            Select2 JS
        ======================================*/
    $('select').niceSelect();


});