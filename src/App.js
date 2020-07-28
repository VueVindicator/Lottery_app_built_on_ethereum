import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.returnList();
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({
      manager: manager,
      players: players,
      balance: balance
    });
  }
  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting for transaction success...'})

    window.ethereum.enable();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'Transaction Successful'})
  }
  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Determining Winner...'});
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({ message: 'Winner has been picked'});
  }
  render(){
  return (
    <div className="App">
    <div className="container">
    <div className="row">
    <div className="col-md-12">
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {this.state.manager}. 
      </p>
      <p>
        There are currently {this.state.players.length} players competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether
      </p>
      <hr/>
      <form onSubmit={this.onSubmit}>
        <h4>Want to try your luck</h4>
        <div className="input-ether">
          <label>Amount of ether to enter</label>
          <input 
            className="form-control"
            value = {this.state.value}
            onChange={ event => this.setState ({ value: event.target.value }) }
          />
        </div><br/>
        <button className="btn btn-primary">Enter Lottery</button>
      </form>
      <hr/>
      <p>Pick a winner</p>
      <button className="btn btn-success" onClick={this.pickWinner}>Pick Winner</button>
      <hr/>
      <button className="btn btn-default">{this.state.message}</button>
    </div>
    </div>
    </div>
    </div>
  );
  }
}

export default App;
