import axios from 'axios'
import React, { useEffect, useState } from 'react'

import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}
const getintialErrors = () => ({
  fullName: "",
  size: "",
  Toppings: "",
})





// 👇 Here you will create your schema.
const schema = yup.object().shape({
  fullName: yup.string()
    .required("Full name is required")
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),

  size: yup.string()
    .required("Size is incorrect")
    .oneOf(["L", "M", "S"], validationErrors.sizeIncorrect),
  topping: yup.array()
    .oneOf(['1', '2', '3', '4', '5'])


})

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]


export default function Form() {

  const [form, setForm] = useState({
    fullName: "",
    size: "",
    toppings: false,
  })

 

 
  const [errors, setErrors] = useState(getintialErrors());
  const [enabled, setenabled] = useState(false)
  const [success, setSuccess] = useState("")
  const [failure, setfailure] = useState(null)
  //const[checkedItems, setCheckedItems] = useState({});



  // 👇 This array could help you construct your checkboxes using .map in the JSX.




  // function Form(){
  //   //const[checkedItems, setCheckedItems] = useState({});
  //   const toppings =[ "pepperoni", "Green Peppers", " Pineapple", "Mushrooms", "Ham"];

  // }

  useEffect(() => {
    schema
      .isvalid(form)
      .then((valid) => setenabled(valid))
      .catch(() => setenabled(false))

  }, [form]);

  const onChange = (evt) => {
    const { name, value, type, checked } = evt.target

    let newValue = type === "checkbox " ? checked : value;
    console.log(name)
    if (name === "fullName") {
      newValue = newValue.trim()
    }
    setFormValue((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    yup.reach(schema, name)
      .validate(newValue)
      .then(() => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }))
      })
      .catch((err) => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: err.errors[0] }))

      })

  }


  const onCheckboxChange = (evt) => {
    const { value, checked } = evt.target;
    let newToppings = [...form.toppings];
    if (checked) {
      newToppings = [...newToppings, value]

    } else {
      newToppings = newToppings.filter((topping) => topping !== value)
    }
    setForm({ ...form, toppings: newToppings })



  }



  const onSubmit = (evt) => {
    evt.preventDefault()
    axios
      .post("http://localhost:9009/api/order", {
        ...form,
        toppings: Array.from(form.toppings),

      })
      .then((res) => {
        setForm({ fullName: "", size: "", toppings: [] });
        setSuccess(res.data.message);
        setfailure(null);
        setenabled(true)
      })
      .catch((err) => {
        setfailure(err.response.data, message);
        setSuccess("");
        setenabled(false);
      });


  };





  return (

   
   <div>
      <h2>Order Your Pizza</h2>
      {success && <div >{success}</div>}
      {failure && (<div> <p> Thank you for your order, {form.fullName}! Your{" "}
            {form.size} pizza with {form.toppings.length} toppings is
            on the way. </p>  {failure}</div>)}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input placeholder="Type full name"
            id="fullName"
            type="text"
            onChange={onChange}
            name="fullName"
            value={form.fullName}
          />
        </div>
        {errors.fullName && <div className='error'>
          {form.fullName.length < 3 
              ? validationErrors.fullNameTooShort
              : form.fullName.length > 20
              ? validationErrors.fullNameTooLong
              : "" }
        </div>}
      </div>
 <form onSubmit={onSubmit}>
      <div className="input-group">
        <div>
          <label htmlFor="size">size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            <option value="">Small</option>
            <option value="">Medium</option>
            <option value="">large</option>

          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">

        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input name="toppings"
              type="checkbox"
              value={topping.topping_id}


              checked={form.toppings.includes(topping.topping_id)}


              onChange={onCheckboxChange}

            />
            {
              topping.text
            }


            <br />

          </label>

        ))}


      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enabled} />
    </form>
    </div>
  )
}
