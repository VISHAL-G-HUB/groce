import React, { useEffect, useState, useRef,PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf'
import myImage from './image/myImage.jpg'
import Popup from 'reactjs-popup';
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

    doc.text(250,20,'INVOICE');
    doc.line(250, 21, 315, 21);
   
    doc.text(50,40,'FROM:')
    doc.text(50,65,'VISHAL GARG')
    doc.text(50,80,'INDIA')
    doc.text(50,100,'1234567891')
    doc.line(50, 110, 250, 110);
    doc.line(250, 35, 250, 200);
    var today = new Date();
    var newdat = "Date: "+ today.getDate()+ "-"+ (today.getMonth()+1) +"-"+today.getFullYear();
    doc.text(450,60,newdat);
    var ne= "Time: " + today.getHours()+ ":"+today.getMinutes()+":"+today.getSeconds();
    doc.text(450,80,ne);
    
    doc.addImage(myImage, 'JPG', 400, 10, 200, 30);
    doc.text(50,130,'BILL TO:')
    doc.text(50,155,person.name.first)
    doc.text(50,175,person.location.city)
    doc.text(50,195,person.phone)

    var col1 = ["ITEM NAME", "PRICE","ITEM QUANTITY","TOTAL PRICE"];
     var rows1 = [];
   items.forEach(element => {      
        var temp1 = [element.itemName,element.price,element.quantity,element.price*element.quantity];
       console.log(temp1);
        rows1.push(temp1);

    });  

    doc.autoTable(col1, rows1, { startY: 220 }); 
     doc.text(250,270+30*rows1.length,'TOTAL ITEM: '+totalItemCount);
    doc.text(250,290+30*(rows1.length),'TOTAL PRICE: '+totalPriceCount);
    doc.save('generated.pdf') 
  }
  const handleAddButtonClick = () => {
    const newItem = {
      itemName: inputValue,
      price: inputPrice,
      quantity: inputQuantity,
      // isSelected: false,
     
    };
     if(newItem.price<0||newItem.price==='')
      {
        alert('ENTER VALID PRICE');
      }
      else if(newItem.quantity<0||newItem.quantity==='')
      alert('ENTER VALID QUANTITY')
      else if(newItem.itemName==='')
      alert('ENTER VALID ITEM')
      else{
    const newItems = [...items, newItem];

    setItems(newItems);
    setInputValue('');
    setInputPrice('');
    setTotalQuantityCount('');
    setTotalItemCount('');
    
  };
  }
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
            <input  id='hide' value={inputValue} onChange={(event) => {
              
              setInputValue(event.target.value)}} className='add-item-input' placeholder='Add an item' type='text' />
            </span>
            <span className='input-change'>
            <input id='hide' value={inputPrice} onChange={(event) => {
              
              setInputPrice(event.target.value)}} className='add-item-input' placeholder='Add price' type='number' />
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
