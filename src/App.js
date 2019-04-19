import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';

function Menu(props) {
  let dishes = props.menu.map(dish => {
    return (
      <tr key={dish.id}>
        <th>{dish.name}</th>
        <th>{dish.description}</th>
      </tr>
    );
  });

  if (props.short_name === "Err") {
    return null;
  } else {
    return (
      <div className="menu-right">
        <h4>Items in Category: ({props.short_name})</h4>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
            {dishes}
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
      selected: [],
      selectedId: "Err"
    };
    this._isMount = false;
  }
  componentDidMount() {
    this._isMount = true;
    axios
      .get("https://stream-restaurant-menu-svc.herokuapp.com/category")
      .then(res => {
        if (this._isMount) {
          this.setState({ menu: res.data });
        }
      });
  }
  componentWillUnmount() {
    this._isMount = false;
  }
  switchSelectedMenuHandler(target) {
    axios
      .get("https://stream-restaurant-menu-svc.herokuapp.com/item", {
        params: { category: target }
      })
      .then(res => {
        console.log(res.data);
        this.setState({ selected: res.data, selectedId: target });
      });
  }
  render() {
    let menuContent = this.state.menu.map(item => {
      return (
        <li
          onClick={() => this.switchSelectedMenuHandler(item.short_name)}
          key={item.id}
        >
          {item.name} - ({item.short_name})
        </li>
      );
    });
    return (
      <>
        <h4>Menu Categories</h4>
        <div id="menu" className="flex-container">
          <ul className="menu-left">{menuContent}</ul>
          <Menu short_name={this.state.selectedId} menu={this.state.selected} />
        </div>
      </>
    );
  }
}
const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement);
export default App;
