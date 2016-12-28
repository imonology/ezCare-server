import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import FileFolder from 'material-ui/lib/svg-icons/file/folder';
import ActionAssignment from 'material-ui/lib/svg-icons/action/assignment';
import Colors from 'material-ui/lib/styles/colors';
import EditorInsertChart from 'material-ui/lib/svg-icons/editor/insert-chart';

import "../../static/css/container.scss"

injectTapEventPlugin();

class PinItems extends React.Component {

	render() {

		return (
			<div id="pin-items" className="flex-33">
				<Tabs>
					<Tab label="Flies" >
						<div>
							<List subheader="Pinned" insetSubheader={true}>
								<ListItem
									leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={Colors.blue500} />}
									rightIcon={<ActionInfo />}
									primaryText="Vacation itinerary"
									secondaryText="Jan 20, 2014"
								/>
								<ListItem
									leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={Colors.yellow600} />}
									rightIcon={<ActionInfo />}
									primaryText="Kitchen remodel"
									secondaryText="Jan 10, 2014"
								/>
							</List>
							<List subheader="All" insetSubheader={true}>
								<ListItem
									leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={Colors.blue500} />}
									rightIcon={<ActionInfo />}
									primaryText="Vacation itinerary"
									secondaryText="Jan 20, 2014"
								/>
								<ListItem
									leftAvatar={<Avatar icon={<EditorInsertChart />} backgroundColor={Colors.yellow600} />}
									rightIcon={<ActionInfo />}
									primaryText="Kitchen remodel"
									secondaryText="Jan 10, 2014"
								/>
							</List>
						</div>
					</Tab>

					<Tab label="Member" >
						<div>
							<h2>Tab Two</h2>
							<p>
								This is another example tab.
							</p>
						</div>
					</Tab>

				</Tabs>

			</div>
		);
	}
}

module.exports = PinItems;
