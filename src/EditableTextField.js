import { TextField, Typography } from "@mui/material";
import Axios from "axios"
import * as React from "react";

export default function EditableTextField({ value, fieldType }) {
  const [fieldValue, setFieldValue] = React.useState(value)
  const [prevValue, setPrevValue] = React.useState(value);
  const [isFieldFocused, setIsFieldFocused] = React.useState(false);
  const [emailValid, setEmailValid] = React.useState(true);
  const [takenEmails, setTakenEmails] = React.useState([]);
  const [emailTaken, setEmailTaken] = React.useState(false);
  const [fieldEmpty, setFieldEmpty] = React.useState(false)

  React.useEffect(() => {
    if (fieldType.toUpperCase() === "EMAIL")
      fetchEmails();
  }, [])

  const resetState = () => {
    setIsFieldFocused(false);
    setEmailValid(true);
    setEmailTaken(false);
    setFieldEmpty(false);
  }

  const onTextClickOff = () => {
    if (!emailValid || emailTaken || fieldEmpty)
    {
      setFieldValue(prevValue);
      resetState();
    }
    else
    {
      updateField()
      resetState();
    }
  }

  const updateField = () => {
    let currentUser = localStorage.getItem("username")
    let url = `http://localhost:8080/user/${currentUser}/${fieldType}/${fieldValue}`
    setPrevValue(fieldValue)
    Axios.put(url)
  }

  const validateEmail = (email) => {
    let email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (email_regex.test(email))
      setEmailValid(true);
    else
      setEmailValid(false)
  };

  const validateField = (field) => {
    console.log(field)
    if (field === "")
    {
      setFieldEmpty(true);
      return;
    }
    else setFieldEmpty(false)

    if (fieldType.toUpperCase() === "EMAIL")
    {
      emailIsTaken(field);
      validateEmail(field);
      return;
    }
  }

  const fetchEmails = async () => {
    let url = "http://localhost:8080/user/email"
    Axios.get(url).then(response => setTakenEmails(response.data))
  }

  const emailIsTaken = (email) => {
    if (email.toUpperCase() === value.toUpperCase())
    {
      setEmailTaken(false)
      return;
    }
    for (let i = 0; i < takenEmails.length; i++) {
      if (email.toUpperCase() === takenEmails[i].toUpperCase()) {
        setEmailTaken(true);
        return;
      }
    }

    setEmailTaken(false)
  }
  
  const displayError = () => {
    if (fieldEmpty)
      return true;
    else if (fieldType.toUpperCase() === "EMAIL")
    {
      if (emailTaken || !emailValid)
        return true;
      
      return false;
    }
  }

  const displayHelperText = () =>{
    if (fieldEmpty)
      return "Please fill out this field"

    else if (fieldType.toUpperCase() === "EMAIL")
    {
      if (emailTaken)
      {
        return "Email is already taken"
      }
      else if (!emailValid)
      {
        return "Not a valid email"
      }        
    }
    else return ""
  }

  

  // const handleFieldValue = e => {
  //   const value = e.target.value;
  //   setFieldValue(value);
  // }
  return (
    <div>
      {!isFieldFocused ? (
        <Typography variant="h6" component="div"
          onClick={() => {
            setIsFieldFocused(true);
          }}
        >
          {fieldValue}
        </Typography>
      ) : (
        <TextField
          error={displayError()}
          helperText={displayHelperText()}
          variant="outlined"
          size="small"
          autoFocus
          value={fieldValue}           
          onChange={e => { setFieldValue(e.target.value); validateField(e.target.value);}}
          onBlur={e => {onTextClickOff()}}
        />
      )}
    </div>
  )
}