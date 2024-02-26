    let offset = 0;
    let currentPage = 1;

    //получение массива id (50 штук, начиная с offset)
    async function fetchItems(offset) {
      const requestOptions = {
        method: 'POST',
        headers: {
          'X-Auth' : md5("Valantis_20240226"),
          'Content-Type': 'application/json',
          'charset': 'utf-8'
        },
        body: JSON.stringify({
          action: 'get_ids',
          params: {
          offset: offset,
          limit: 50
          }
        })
      };
        
      try {
        const response = await fetch('http://api.valantis.store:40000/', requestOptions);
        if (response.ok) {
          const data = await response.json();
          return data.result;
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
    }

//получаю информацию о товаре по id
async function fetchItemDetails(itemId) {
    const requestOptions = {
        method: 'POST',
        headers: {
          'X-Auth' : md5("Valantis_20240226"),
          'Content-Type': 'application/json',
          'charset': 'utf-8'
        },
        body: JSON.stringify({
          action: 'get_items',
          params: {
            ids: [itemId]
          }
        })
    };

    try {
        const response = await fetch('http://api.valantis.store:40000/', requestOptions);
        if (response.ok) {
          const data = await response.json();
          return data.result[0]; // Возвращаем только первый товар
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

//отображение таблицы товаров
async function renderProductTable(itemIds) {
    let tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';
        
    for (let i = 0; i < itemIds.length; i++) {
    let tr = document.createElement('tr');
    let itemDetails = await fetchItemDetails(itemIds[i]);
        
        for (let key in itemDetails) {
            let td = document.createElement('td');
            td.textContent = itemDetails[key];
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
        document.getElementById('currentPage').innerText = `Page: ${currentPage}`;
    }
}

//страница вперед
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        offset -= 50;
        displayItems();
    }
}
  
//страница назад
function nextPage() {
    currentPage++;
    offset += 50;
    displayItems();
}

//вывод говна
async function displayItems() {
    let itemIds = [];
    itemIds = fetchItems(offset);
    renderProductTable(itemIds);

}

displayItems();