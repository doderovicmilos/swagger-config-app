import React, {useState} from 'react';


const SignUpForm = (props) => {
  const { onSubmit } = props;
  const [user, setUser] = useState({email: '', password: '', password2: ''})

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser(previous => ({...previous, [name]: value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(user);
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div className='mb-3'>
        <label htmlFor='email' className='form-label'>Email: </label>
        <input
          type='email'
          id='email'
          name='email'
          value={user.email}
          onChange={handleChange}
          className='form-control'
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>Password: </label>
        <input
          type='password'
          id='password'
          name='password'
          value={user.password}
          onChange={(e) => handleChange(e)}
          className='form-control'
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='repeatedPassword' className='form-label'>Repeat password: </label>
        <input
          type='password'
          id='password2'
          name='password2'
          value={user.repeatedPassword}
          onChange={(e) => handleChange(e)}
          className='form-control'
        />
      </div>
      <button type='submit' className="btn btn-primary">Sign up</button>
    </form>
  );

}

export default SignUpForm;