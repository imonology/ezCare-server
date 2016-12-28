import React from 'react';
import ReactDOM from 'react-dom';
// import $ from 'jquery';

import Nav from './navbar';
import ChannelList from './channelList';
import ChatRoom from './chatroom';
import PinItems from './pinitems';

import "../../static/css/style.css";
import "../../static/css/container.scss";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.handleChangeChannel = this.handleChangeChannel.bind(this);
		this.onConnect = this.onConnect.bind(this);
		this.onMeety = this.onMeety.bind(this);
		this.handleUpdateChannel = this.handleUpdateChannel.bind(this);
		this.state = {
			currentChannel: null,
			updateChannel: 0
		};
	}
	componentDidMount() {
		document.addEventListener ("DOMContentLoaded", function () {
			IC.setSocketServer({port: 38130, onDone: this.onConnect});
		}.bind(this));
	}
	onConnect() {
		IC.subscribe('meety', 1, this.onMeety);
	}
	onMeety(data, ch) {
		if(data.data['old_val']) { // update msg
			console.log(data.data['old_val'])
		} else { // new msg
			console.log('%%%');
			this.setState({
				currentChannel: this.state.currentChannel
			});
		}
	}
	handleChangeChannel(channelName) {
		this.setState({
			currentChannel: channelName
		});
	}
	handleUpdateChannel() {
		this.setState({
			updateChannel: +this.state.updateChannel + 1
		});
	}
	render() {
		return (
			<div>
				<Nav channelName={this.state.currentChannel} onUpdate={this.handleUpdateChannel}/>
				<div className="container">
					<ChannelList onChange={this.handleChangeChannel} shouldUpdate={this.state.updateChannel} currentChannel={this.state.currentChannel} />
					{ this.state.currentChannel ? <ChatRoom channelName={this.state.currentChannel} /> : null }
					{ this.state.currentChannel ? <PinItems /> : null }
				</div>
			</div>
		);
	}
}


module.exports = App;
