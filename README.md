# DevConnect
DevConnect is a social media platform for developers, allowing users to create a profile and communicate with others through posts and comments. This website was created follwowing Brad Traversy's course on Node.js, MongoDB, React and Redux.
## Technologies Used
* MongoDB - Storing profiles, login information, posts, and comments
* Node.js, Express
* Mongoose - For data managing, schema validation, and connection between MongoDB and Node.js
* Bcrypt - Hashing user passwords
* jsonwebtokrn - For session authentication
* React, Redux, HTML, CSS 
## Knowledge Acquired
Below is a list of some useful tricks/processes I picked up during the website's creation.
### Backend: Implementation of Middleware into Protected Routes
Instead of manually checking for a valid token at every express route that requires a user to be logged in, implenmenting an authorization middleware to insert at every "private" route definition was done. This allowed for much modular process while constructing API endpoints. 
```javascript
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) { //middleware arguments
    //Get token from header
    const token = req.header('x-auth-token'); //get token from the header

    // Check if no token 
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied'}); //ends here
    } 

    //Verify Token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user //payload decoded includes the user - "req.user" now can be accessed in the route. 
        next(); //goes on to the rest of the request
    } catch {
        res.status(401).json({ msg: 'Token is not valid'});
    }
}
```
Auth middleware in use:
```javascript
// @route  GET api/auth
// @desc   Validate Token in header
// @access Protected
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
```
### Backend: Specifying fields Fetched in Queries
When running a GET request to fetch a user's profile, the user's id in the params of the request is used to query the database. That id is connected by reference to the "user" field in the profile. To get the name and avatar for the user along with the profile: 
```javascript
  const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
```
This process of retrieving additional data by reference will be invaluable when making calls from React-Redux.

### Backend: ObjectId fields in Models are not strings. 
### Frontend: Creating an "Alert" Slice of State
Because actions can be called from anywhere, having an alert state and a "setAlert()" action allows the user to know if their process went through. The alert state is an array that will keep collecting messages. Then the errors are rendered in the component. To get rid of the errors after a specified amount of time, setTimeout can be used to dispatch an action to remove an alert. 
Set Alert action: 
```javascript
case SET_ALERT: //we need to return changes to the state
           return [...state, payload]; //state is immutable, so include any state present
```
Remove Alert action:
```javascript
case REMOVE_ALERT:
           return state.filter(alert => alert.id !== payload); //we control payload in dispatch
```
Incorporating the REMOVE_ALERT action in the SET_ALERT action: (timeout is specified in milliseconds as an argument in function definition)
```javascript
setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id}), timeout)
```
### Frontend: Incorporating a Spinner Component
The rendering of this component will be dependent on the "loading" key present in each part of the state. If "true" (default), that means that the data is being fetched, so the spinner is rendered on to the page. If "false" the data fetching process is done. 
Spinner.js:
```javascript
import React, { Fragment } from 'react';
import spinner from './spinner.gif';

export default function foo() {
  return (
    <Fragment>
      <img
        src={spinner}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt='Loading...'
      />
    </Fragment>
  );
}
```
Incorporating the spinner component to the user dashboard page. The spinner gif is rendered while the data is being loaded.
```javascript
const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
```
### Frontend: Dynamically Disabled/Enabled Field Linked to Separate Field Input
When the user is adding experience, the "to" date field should be disabled when the "current" box is checked. Creating a useState hook that toggles the "to" field is used. 
```javascript
const [toDateDisabled, toggleDisabled] = useState(false);
```
Setting an onChange to the "current" checkbox which sets formData  as well as toDateDisabled:
```javascript
<div className='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              checked={current}
              value={current}
              onChange={e => {
                setFormData({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
            />
            {''} Current Job
          </p>
        </div>
```
"to" field:
```javascript
<div className='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            value={to}
            onChange={e => onChange(e)}
            disabled={toDateDisabled ? 'disabled' : ''}
          />
        </div>
```


