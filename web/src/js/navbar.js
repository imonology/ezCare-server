import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import $ from 'jquery';

import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert';
import InsertDriveFile from 'material-ui/lib/svg-icons/editor/insert-drive-file';
import Info from 'material-ui/lib/svg-icons/action/info';
import Colors from 'material-ui/lib/styles/colors';

import "../../static/css/container.scss"

class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.state = {
			open: false
		};
	}
	handleIconClick() {
		$("#pin-items").toggleClass("hide");
	}
	handleOpen() {
		this.setState({
			open: true
		});
	}
	handleClose() {
		this.setState({
			open: false
		});
	}
	handleEdit() {
		this.setState({
			open: false
		});
		$.ajax({
			url: '../event/update_channel', 
			type: 'get', 
			dataType: 'json', 
			data: {
				name: this.props.channelName, 
				title: this.refs.editTitle.getValue(), 
				desc: this.refs.editDesc.getValue()
			}, 
			success: function(data) {
				console.log(data);
				this.props.onUpdate();
			}.bind(this),
			error: function(jqXHR) {
				console.log('update_channel_ERR: ');
				console.dir(jqXHR);
			}
		});
	}
	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				secondary={true}
				onTouchTap={this.handleClose}
			/>,
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.handleEdit}
			/>,
		];
		return (
			<div>
				<AppBar
					title="Meety"
					iconElementRight={
						<div>
							<TextField
								className="flex-33"
								hintText={this.props.channelName}
								floatingLabelText="Search..."
							/>
							<IconButton onClick={this.handleIconClick}>
								<Info />
							</IconButton>
							<IconButton onClick={this.handleIconClick}>
								<InsertDriveFile />
							</IconButton>
							<IconMenu
								iconButtonElement={<IconButton><MoreVert /></IconButton>}
								anchorOrigin={{horizontal: 'right', vertical: 'top'}}
								targetOrigin={{horizontal: 'right', vertical: 'top'}}
							>
								<MenuItem primaryText="Mute" />
								<MenuItem primaryText="Edit" onTouchTap={this.handleOpen} />
								<MenuItem primaryText="Leave Channel" />
							</IconMenu>
							<Dialog
								title="Edit Channel"
								actions={actions}
								modal={false}
								open={this.state.open}
								onRequestClose={this.handleClose}
							>
								Channel Title: <TextField ref="editTitle" hintText="Channel title"/><br />
								Channel Desc : <TextField ref="editDesc" hintText="Channel description"/>
							</Dialog>
						</div>
					}
			    />
			</div>
		);
	}
}

module.exports = Navbar;
