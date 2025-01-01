import React, { Component } from 'react';
import './textedit.css';
import { io } from 'socket.io-client';

const socket = io('https://jb-nu.vercel.app/');

class TextEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  handleChange = (event) => {
    const text = event.target.value;
    this.setState({ text });
    socket.emit('text-change', text); //mengirim
  };

  componentDidMount() {
    socket.on('text-update', (text) => {
      this.setState({ text });  //perbarui
    });
  }

  render() {
    return (
      <div className="text-edit-container">
        <h1>Selamat Datang di JalaKata</h1>
        <h4>"Aplikasi Dokumen Kolaboratif"</h4>
        <textarea
          rows="10"
          cols="50"
          placeholder="Tuliskan teks disini"
          value={this.state.text}
          onChange={this.handleChange} 
        ></textarea>
      </div>
    );
  }
}

export default TextEdit;
