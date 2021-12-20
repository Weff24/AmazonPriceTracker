/*
Check if #add-item-button is clicked. If clicked, 
#add-item-url is opened and the background is blurred.
*/
let urlForm = document.querySelector('#add-item-url');
let bgBlur = document.querySelector('#bg-blur');
let urlFormOpen = document.querySelector('#add-item-button');
urlFormOpen.addEventListener('click', () => {
    urlForm.style.display = 'block';
    bgBlur.style.display = 'block';
});

/*
Check if #add-item-close is clicked. If clicked, 
#add-item-url is closed and the background blur is removed.
*/
let urlFormClose = document.querySelector('#add-item-close');
let urlFormElement = document.querySelector('#add-item-url-form');
urlFormClose.addEventListener('click', () => {
    urlFormElement.reset();
    urlForm.style.display = 'none';
    bgBlur.style.display = 'none';
});

/*
Check if #add-item-url-form is submitted. If submitted, 
#add-item-url is closed and the loading animation appears.
*/
let loadAnimation = document.querySelector('#load-animation');
urlFormElement.addEventListener('submit', () => {
    urlForm.style.display = 'none';
    loadAnimation.style.display = 'block';
    //let currentPrice = scraper.getData(url);
    //currentPriceElement.innerText = currentPrice;
    /*scraper.getData(url)
        .then((price) => {
            currentPriceElement.innerText = currentPrice;
        });*/
});