import React from 'react';
import ReactDOM from 'react-dom';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import Avatar from 'material-ui/lib/avatar';
import FileFolder from 'material-ui/lib/svg-icons/file/folder';
import $ from 'jquery';

import "../../static/css/container.scss"
import '../../static/css/channelList.css';

class ChannelList extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.getChannel = this.getChannel.bind(this);
		this.state = {
			channelList: []
		};
	}
	componentDidMount() {
		this.getChannel();
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.shouldUpdate != this.state.shouldUpdate) {
			this.getChannel();
		}
	}
	getChannel() {
		$.ajax({
			url: '../event/get_channel', 
			type: 'post', 
			dataType: 'json', 
			success: function(data) {
				if(data.P.ok) {
					if (this.props.currentChannel == null) {
						this.props.onChange(data.P.ok[0].name)
					}
					this.setState({
						channelList: data.P.ok
					});
				}
			}.bind(this), 
			error: function(jqXHR) {
				console.log('get_channel_ERR: ');
				console.log(jqXHR);
			}
		});
	}
	handleClick(ref) {
		var item = this.refs[ref];
		var channelName = item.props.primaryText;
		this.props.onChange(channelName);
	}
	render() {
		return (
			<div className="channelList">
				<List subheader="Channels" insetSubheader={true}>
					{
						this.state.channelList.map(function(val, i) {
							return (
								<ListItem
									key={i}
									leftAvatar={<Avatar>{val.name[0]}</Avatar>}
									rightIcon={<ActionInfo />}
									primaryText={val.name}
									secondaryText={val.desc}
									ref={'listItem' + i}
									channelID={val.id}
									channelNum={val.member.length}
									onClick={this.handleClick.bind(this, ('listItem' + i))}
								/>
							);
						}.bind(this))
					}
				</List>
			</div>
		);
	}
}

module.exports = ChannelList;
