import React, { useEffect, useState, useRef,PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
 //...............................
 
 
  
//...............................
const App = () => {
  const [items, setItems] = useState([

  ]);

 
  const [inputValue, setInputValue] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [inputPrice, setInputPrice] = useState('');
  const [totalPriceCount, setTotalPriceCount] = useState(0);
  const[inputQuantity,setTotalQuantityCount]=useState('');
  const [person, setPerson] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://api.randomuser.me/");
      const data = await response.json();
      const [item] = data.results;
      setPerson(item);
    };
    fetchData();
  }, []);
   const jsPdfGenerator=()=>
  {
    var doc = new jsPDF('p','pt');
    doc.text(250,100,'INVOICE');
    doc.text(50,130,'BILL TO:')
    doc.text(50,155,person.name.first)
    doc.text(50,175,person.location.city)

    var col1 = ["ITEM NAME", "PRICE","ITEM QUANTITY","TOTAL PRICE"];
     var rows1 = [];
   items.forEach(element => {      
      console.log("nu");
      console.log(element);
        var temp1 = [element.itemName,element.price,element.quantity,element.price*element.quantity];
       console.log(temp1);
        rows1.push(temp1);

    });    

    doc.autoTable(col1, rows1, { startY: 200 }); 
     doc.text(250,250+30*rows1.length,'TOTAL ITEM: '+totalItemCount);
    doc.text(250,270+30*(rows1.length),'TOTAL PRICE: '+totalPriceCount);
    doc.save('generated.pdf') 
  }
  const handleAddButtonClick = () => {
    const newItem = {
      itemName: inputValue,
      price: inputPrice,
      quantity: inputQuantity,
      // isSelected: false,
    };

    const newItems = [...items, newItem];

    setItems(newItems);
    setInputValue('');
    setInputPrice('');
    setTotalQuantityCount('');
    setTotalItemCount('');
    
  };
  useEffect(() => {
    calculateTotal();
  },[items]);

  const handleQuantityIncrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity++;

    setItems(newItems);
    calculateTotal();
  };

  const handleQuantityDecrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity--;

    setItems(newItems);
    calculateTotal();
  };

  const toggleComplete = (index) => {
    const newItems = [...items];

    newItems[index].isSelected = !newItems[index].isSelected;

    setItems(newItems);
  };

  const calculateTotal = () => {
    const totalItem = items.reduce((total, item) => {
      let x= total + parseInt(item.quantity);
     // console.log(x);
      return x;
    }, 0);

    const totalPriceCount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  console.log(totalItem)

    setTotalItemCount(totalItem);
    setTotalPriceCount(totalPriceCount);
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  

  return (
    <BrowserRouter>
    
      <div  className='app-background' ref={componentRef}>
        <div className='add-item-input-new' id='hide'>Grocery Billing App</div>
        <div className='main-container'>
          {person && <div>Hey <strong>{person.name.first}! from {person.location.city} </strong> <br></br>Phone no: {person.phone} </div>}
          <div className='add-item-input-new' id='hide'>  Add your grocery items</div>
          <div className='add-item-box'>
            <span className='input-change'>
            <input  id='hide' value={inputValue} onChange={(event) => {setInputValue(event.target.value)}} className='add-item-input' placeholder='Add an item' type='text' />
            </span>
            <span className='input-change'>
            <input id='hide' value={inputPrice} onChange={(event) => setInputPrice(event.target.value)} className='add-item-input' placeholder='Add price' type='number' />
            </span>
            <span className='input-change'>
            <input id='hide' value={inputQuantity} onChange={(event) => setTotalQuantityCount(event.target.value)} className='add-item-input' placeholder='Quantity' type='number' />
            </span>
            <FontAwesomeIcon id='hide' icon={faPlus} onClick={() => handleAddButtonClick()} />
          </div>
          
          <div className='item-list'>
           
            {items.map((item, index) => (
              <div className='item-container'>
                <div className='item-name' onClick={() => toggleComplete(index)}>
                  {item.isSelected ? (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span className='completed'>{item.itemName}</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCircle} />
                      <span>{item.itemName}</span>
                    </>
                  )}
                </div>
                <div className='quantity'>
                  <button>
                    <FontAwesomeIcon icon={faChevronLeft} onClick={() => handleQuantityDecrease(index)} />
                  </button>
                  <span>{item.quantity}</span>
                  <button>
                    <FontAwesomeIcon icon={faChevronRight} onClick={() => handleQuantityIncrease(index)} />
                  </button>
                </div>
                <div className="price">
                  <span>{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className='total'>Total Items: {totalItemCount} Price: {totalPriceCount}</div><button>Print</button>
        </div>
        <button id='hide' onClick={jsPdfGenerator}>Print this out!</button>
      </div>
    </BrowserRouter>
  );
};

export default App;
