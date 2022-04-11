const apiUrl = 'https://api.airtable.com/v0/appElurJfZ2WmdIUg/Furniture/?api_key=keys1gmUsZYDi7y0g';
let page = 1;
let showingFiltered = true;
let cloneElementList;
(async () => {
  document.addEventListener("DOMContentLoaded", async function() {
    const loaderEl = document.querySelector('.loader');
    const originalData = await getData(loaderEl);
    const itemsPerPage = 5;
    const searchInput = document.querySelector('.search-input');
    searchInput.style.marginBottom = '10px';
    showLoader(false, loaderEl);
    renderList(true, pagination(originalData, page, itemsPerPage));
    createPagination(originalData, itemsPerPage, page);
    searchInput.addEventListener('input', debounce(async (e) => {
      page = 1;
      const searchValue = e.target.value;
      if (searchValue) {
        showLoader(true, loaderEl);
        const filteredData = await filterData(originalData, searchValue);
        renderList(true, pagination(filteredData, page, itemsPerPage));
        setTimeout(() => showLoader(false, loaderEl), 500);
        createPagination(filteredData, itemsPerPage, page);
        showingFiltered = true;
      } else {
        if (showingFiltered) {
          showLoader(false, loaderEl);
          renderList(true, pagination(originalData, page, itemsPerPage));
          createPagination(originalData, itemsPerPage, page);
          showingFiltered = false;
        }
      }
    }, 500, loaderEl));
  })
})();

async function filterData(data, searchValue) {
  return data.filter(item => item.fields.Name.toLowerCase().includes(searchValue.toLowerCase()));
}

function changePagina (data, newPage) {
  if (newPage !== page) {
    page = newPage;
    renderList(true, pagination(data, page, 5))
    document.querySelectorAll('.pagination ul li').forEach((item, index) => item.style.color = index + 1 === page ? 'blue' : '#000');
  }
}

function debounce(callback, wait, loader) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

function createPagination(data, itemsPerPage, currentPage) {
  const pages = Math.ceil(data.length / itemsPerPage);
  const paginationEl = document.querySelector('.pagination');
  const paginationList = document.createElement('ul');
  paginationEl.innerHTML = '';
  paginationList.style.display = 'flex';
  paginationList.style.listStyle = 'none';
  paginationList.classList.add('pagination__list');
  for (let i = 1; i <= pages; i++) {
    const paginationItem = document.createElement('li');
    paginationItem.style.marginRight = '10px';
    paginationItem.style.marginLeft = '10px';
    paginationItem.style.cursor = 'pointer';
    if (currentPage === i) {
      paginationItem.style.color = 'blue';
    } else {
      paginationItem.style.color = '#000';
    }
    paginationItem.addEventListener('click', (e) => changePagina(data, i));
    paginationItem.classList.add('pagination__item');
    paginationItem.innerHTML = i;
    paginationList.appendChild(paginationItem);
  }
  paginationEl.appendChild(paginationList);
}


function pagination(items, page, perPage) {
  const start = (page - 1) * perPage;
  const end = page * perPage;
  return items.slice(start, end);
}

async function getData (loader){
  showLoader(true, loader);
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.records || [];
}

function renderList(isNew, items) {
  const list = document.querySelector('.list');
  let itemExample;
  if (!cloneElementList) {
    cloneElementList =  document.querySelector('.item').cloneNode(true);
  }
  itemExample = cloneElementList.cloneNode(true);
  let adding = 0;
  if (isNew) {
    list.innerHTML = '';
  }
  items.forEach(item => {
    const itemEl = itemExample.cloneNode(true);
    const imgEl = itemEl.querySelector('img');
    imgEl.src = item.fields.Images[0].url;
    imgEl.alt = item.fields.Name;
    imgEl.title = item.fields.Name;
    list.appendChild(itemEl);
    setTimeout(() => fadeIn(itemEl), adding * 300);
    adding++;
  })
}

function showLoader (show, loader) {
  if (show) {
    fadeIn(loader);
  } else {
    fadeOut(loader);
  }
}

function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "block";
  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};

function fadeOut(el) {
  el.style.opacity = 1;
  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
};