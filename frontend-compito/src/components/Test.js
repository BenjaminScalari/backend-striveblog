import React, { useEffect, useState } from 'react'

export default function Test() {

  const [user, setUser] = useState([])

  useEffect(() => {

  fetch("http://localhost:5001/authors")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
    

  }, [])

  return (
    <>
      <h1>Ciao</h1>

      <ul>
        {user.map((singleUser) => (
          <li>
            <h1>{singleUser.name}</h1>
            <h1>{singleUser.surname}</h1>
            <h1>{singleUser.email}</h1>
            <h1>{singleUser.birthday}</h1>
            <h1>{singleUser.avatar}</h1>
          </li>
        ))}
      </ul>
    </>
  );

}