import React from 'react';
import Home from './screen/Home';
import ReservedBubbleX from './screen/ReservedBubbleX';
import Marketplace from './screen/Marketplace';
import CharacterMarketplace from './screen/CharacterMarketplace';
import MyCharacters from "./screen/MyCharacters";
import Transactions from "./screen/Transactions"
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

// Redux
import { Provider } from 'react-redux';
import store from './store';


function App() {

	return (
		<Provider store={store}>
			<React.Fragment>
				<Router>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/ReservedBubbleX" component={ReservedBubbleX} />
						<Route exact path="/Transactions" component={Transactions} />
						<Route exact path="/Marketplace" component={Marketplace} />
						<Route exact path="/Marketplace/Sai" component={CharacterMarketplace} />
						<Route exact path="/MyCharacters" component={MyCharacters} />
					</Switch>
				</Router>
			</React.Fragment>
		</Provider>
	);
}

export default App;
