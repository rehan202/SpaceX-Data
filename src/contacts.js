import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';





const Contacts = ({ contacts }) => {
 
  
  return (
    <div>

      <center><h1>SpaceX Missions</h1></center>
    
      
		
		
		 {contacts.map((contact) => (
      
      
  
      <div class="card">
           <div class="card-body">
             <h5 class="card-title">{contact.name}</h5>
             <h6 class="card-subtitle mb-2 text-muted">{contact.details}</h6>
             <p class="card-text">{contact.success}</p>
             <img src={contact.links.patch.small}></img>
           </div>
         </div>
         ))}
		
    </div>
  )
};

  export default Contacts

