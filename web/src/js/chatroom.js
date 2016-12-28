import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';

// import MobileTearSheet from '../../../MobileTearSheet';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';

import "../../static/css/container.scss"

class ChatRoom extends React.Component {
	constructor(props) {
		super(props);
		this.handleEnter = this.handleEnter.bind(this);
		this.getMsg = this.getMsg.bind(this);
		this.state = {
			msgList: []
		}
	}
	componentDidMount() {
		var channelName = this.props.channelName;
		this.getMsg();
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.channelName != this.state.channelName) {
			this.getMsg();
		}
	}
	getMsg() {
		$.ajax({
			url: '../event/get_message', 
			type: 'post', 
			dataType: 'json', 
			data: {
				channel: this.props.channelName
			}, 
			success: function(data) {
				if(data.P.ok) {
					this.setState({
						msgList: data.P.ok
					});
				}
			}.bind(this), 
			error: function(jqXHR) {
				console.log('get_message_ERR: ');
				console.dir(jqXHR);
			}
		})
	}
	handleEnter(e) {
		var msg = this.refs.msgInput.getValue();
		var username = 'testUser';
		$(ReactDOM.findDOMNode(this.refs.msgInput)).find('input').val('');
		$.ajax({
			url: '../event/send_message', 
			type: 'post', 
			dataType: 'json', 
			data: {
				tid: (new Date()).getTime() + '_' + username, 
				username: username, 
				channel: 'meety', 
				msg: msg, 
				timestamp: (new Date()).getTime()
			}, 
			success: function(data) {
				console.log(data);
			}, 
			error: function(jqXHR) {
				console.log('send_message_ERR: '); 
				console.dir(jqXHR);
			}
		});
	}
	render() {
		const style = {
			marginLeft: 20,
			width: '90%'
		};
		const listStyle = {
			minHeight: '500px', 
			height: '72vh', 
			overflow: 'auto'
		};
		return (
			<div className="flex-66">
				<Paper zDepth={1}>
					<div>
		  				<List style={listStyle}>
		  					{
		  						this.state.msgList.map(function(val, i) {
		  							return (
		  								<ListItem 
		  									key={i}
		  									id={val.id}
		  									ref={val.id}
											leftAvatar={<Avatar>{val.username[0]}</Avatar>}
											primaryText={val.username}
											secondaryText={<p>{val.msg}</p>}
											secondaryTextLines={2}
										/>
		  							);
		  						})
		  					}
		  				</List>
					</div>
					<Divider />
					<TextField hintText="Message..." style={style} underlineShow={false} ref="msgInput" defaultValue="" onEnterKeyDown={this.handleEnter} />
				</Paper>
			</div>
		);
	}
}

module.exports = ChatRoom;
