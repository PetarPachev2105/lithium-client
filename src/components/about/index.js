import React, { Component } from 'react';
import styles from './about.module.css';
import mainGif from '../../assets/main.gif'

// Also used for copy-paste for creating new components
class About extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {}

        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.component}>
                <h3>About Lithium</h3>
                <p>Blah blah blah blah blah</p>
                <img src={mainGif} alt={'Main'} height={'400px'} width={'600px'}/>
            </div>
        )
    }
}

export default About;