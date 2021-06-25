function DisplayComponent() {
    
    let container = document.querySelector("#grid");

    let itemInfos = JSON.parse(localStorage.getItem("itemInfos"))
  
    container.innerHTML = "";
    let totalNumberOfItems = 0, itemsInStock = 0, itemsAlmStock = 0, itemsOutStock = 0;
    let a = 0, b = 0, c = 0, d = 0;

    if (itemInfos) {
    itemInfos.forEach(function(el) {
      const item = document.createElement("div");
      const quantity = document.createElement("div");
      const category = document.createElement("div");
      const description = document.createElement("div");
      const label = document.createElement("span")
      const date = document.createElement("div");
      
      item.textContent = el.item;
      label.classList.add("label-check")
      const checkLabel = (qty) => {
        qty = parseInt(qty)
        if (qty === 0) {
          label.classList.add("outstock");
          return;
        }
        ((qty>0) && (qty<21))? label.classList.add("almost"): label.classList.add("instock")
        
      }

      totalNumberOfItems += parseInt(el.quantity);
      a += 1;

      if (el.quantity > 0 && el.quantity < 20){
        itemsAlmStock += parseInt(el.quantity);
        b += 1;
      }

      if (el.quantity > 20){
        itemsInStock += parseInt(el.quantity);
        c += 1;
      }

      if (el.quantity == 0){
        itemsOutStock += 1;
      }   

      checkLabel(el.quantity)
      quantity.textContent = el.quantity;
      quantity.appendChild(label);
      quantity.classList.add("quantity")
      category.textContent = el.category;
      description.textContent = el.description;
      date.textContent = el.today;
  
      if (el.completed === true) {
        item.className = "done";
      } else {
        item.classList.remove("done");
      }
  
      item.addEventListener("click", taskCompleted);
  
      let buttons = document.createElement("div"),
        edit = document.createElement("button"),
        del = document.createElement("button");
      del.id = el.id;
      edit.id = el.id2;
      edit.innerText = "edit";
      del.innerText = "delete";
      edit.addEventListener("click", editItem);
      del.addEventListener("click", deleteItem);
  
      buttons.appendChild(del);
      buttons.appendChild(edit);
      container.appendChild(item);
      container.appendChild(quantity);
      container.appendChild(category);
      container.appendChild(description);
      container.appendChild(date);
      container.appendChild(buttons);
    });
    document.querySelector("#total").innerText = `total number of items: ${a} of quantity ${totalNumberOfItems}`;
    document.querySelector("#instk").innerText = `items in stock: ${c} of quantity ${itemsInStock}`;
    document.querySelector("#almstk").innerText = `items almost out of stock: ${b} of quantity ${itemsAlmStock}`;
    document.querySelector("#outstk").innerText = `items out of stock: ${itemsOutStock}`;
  }
};

// this function delete items from the list
const deleteItem = function(e) {
    del = document.querySelector('#del').style.display = "";
    document.querySelector(".overlay").classList.add("show");
    let delButton = null, p = null;

    //Get  from localStorage
    let itemInfos = JSON.parse(localStorage.getItem("itemInfos"));

    del = document.querySelector('#del');

    p = document.createElement("p")
    del.appendChild(p) 

    for (let i = 0; i < itemInfos.length; i++) {
      if (itemInfos[i].id == this.id) {
        p.innerText = `${itemInfos[i].quantity} ${itemInfos[i].item} of category ${itemInfos[i].category}`
        p.style.color = "white"
        break;
      }
    }
    del.appendChild(p) 
    delButton = document.createElement("button")
    cancelButton = delButton.cloneNode()

    delButton.innerText = "Delete"
    cancelButton.innerText = "Cancel"

    delButton.classList.add("add-btn")
    cancelButton.classList.add("add-btn")

    del.appendChild(delButton) 
    del.appendChild(cancelButton) 

    const main = this.id;

    const clearItem = () => {
        
        for (let i = 0; i < itemInfos.length; i++) {
            if (itemInfos[i].id == main) {
                //     // Remove from array
                itemInfos.splice(i, 1);
                // Re-set back to localStorage
                localStorage.setItem("itemInfos", JSON.stringify(itemInfos)); 
                break
            }
        }
        del.removeChild(delButton)
        del.removeChild(cancelButton)
        del.removeChild(p)
        document.querySelector(".overlay").classList.remove("show");
        del = document.querySelector('#del').style.display = "none";
        DisplayComponent();
    }

    const cancelDelete = () => {
        del.removeChild(delButton)
        del.removeChild(cancelButton)
        del.removeChild(p)
        document.querySelector(".overlay").classList.remove("show");
        del = document.querySelector('#del').style.display = "none";
        DisplayComponent();
    }

    delButton.addEventListener("click", clearItem);
    cancelButton.addEventListener("click", cancelDelete);
  
  };

const saveItems = function(e) {
    let item = document.querySelector("#input1").value;
    let quantity = document.querySelector("#input2").value;
    let category = document.querySelector("#cars").value;
    let description = document.querySelector("#input3").value;
    let date = new Date();
    let completed = false;
    let today = date.toDateString();
    let id = Math.random()
      .toString(36)
      .substring(5);
    let id2 = generateID();
  
    function generateID() {
      let text = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
      for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
    if (!item || !quantity || !category || !description) {
      alert("Please add your inventories!!");
      return false;
    }
  
    // create an objects to push inside an array
    let itemInfo = {
      item,
      quantity,
      category,
      description,
      completed,
      id,
      id2,
      today
    };
  
    if (localStorage.getItem("itemInfos") === null) {
      // Init the empty array
      let itemInfos = [];
  
      // Add to array
      itemInfos.push(itemInfo);
      // Set to localStorage
      localStorage.setItem("itemInfos", JSON.stringify(itemInfos));
    } else {
      // Get item from localStorage
      let itemInfos = JSON.parse(localStorage.getItem("itemInfos"));
      // Add item to array
      itemInfos.push(itemInfo);
      // Re-set back to localStorage
      localStorage.setItem("itemInfos", JSON.stringify(itemInfos));
    }
  
    document.querySelector("#myForm").reset();
  
    DisplayComponent();
  };

// to edit item from the shopping list
const editItem = e => {
    document.querySelector("#inputs-list").style.display = "";
    document.querySelector(".overlay").classList.add("show");
    let item = document.querySelector("#input1");
    let quantity = document.querySelector("#input2");
    let description = document.querySelector("#input3");
    let category = document.querySelector("#cars");
    let addButton = document.querySelector("#submit");
  
    let itemInfos = JSON.parse(localStorage.getItem("itemInfos"));
  
    for (let i = 0; i < itemInfos.length; i++) {
      if (itemInfos[i].id2 == e.target.id) {
        item.value += itemInfos[i].item;
        quantity.value += itemInfos[i].quantity;
        description.value += itemInfos[i].description;
        category.value += itemInfos[i].category;
        itemInfos.splice(i, 1);
  
        addButton.innerText = "Update";
        addButton.style.background = "rgb(18, 203, 196)";
      }
    }
    localStorage.setItem("itemInfos", JSON.stringify(itemInfos));
  };

const taskCompleted = e => {
    console.log(e);
    // this.classList.toggle("done");
    let itemInfos = JSON.parse(localStorage.getItem("itemInfos"));
    let p = e.target.nextSibling.nextSibling.nextSibling;
  
    itemInfos.forEach((el, i) => {
      if (el.id == p.innerText) {
        el.completed = !el.completed;
      }
    });
  
    localStorage.setItem("itemInfos", JSON.stringify(itemInfos));
    DisplayComponent();
  };

const DashboardPage = {
    setup(){
        document.querySelector("#inputs-list").style.display = ("none");
        document.querySelector("#del").style.display = "none"
        DisplayComponent();

        const displayAdd = document.querySelector("#add");
    
        displayAdd.addEventListener("click", function() {
            document.querySelector("#inputs-list").style.display = ("");
            document.querySelector(".overlay").classList.add("show");
        })
    },  
}

const AddPage = {
    setup(){
        let add = document.querySelector("#submit");
        let cancelAdd = document.querySelector("#cancel");
        add.addEventListener("click", function() {
        saveItems();

        document.querySelector("#inputs-list").style.display = "none";
        document.querySelector(".overlay").classList.remove("show");
        document.querySelector("#del").style.display = "none"
        });

        cancelAdd.addEventListener("click", function() {
            document.querySelector("#inputs-list").style.display = "none";
            document.querySelector(".overlay").classList.remove("show");
            document.querySelector("#del").style.display = "none"
            });

        DisplayComponent();
    }
}


const App = {
    init(){
        DashboardPage.setup();
        AddPage.setup();
    }
}

App.init();