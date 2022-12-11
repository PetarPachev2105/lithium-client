import React, { Component } from 'react';
import styles from './loadingAnimation.module.css'
import loadingGif from '../../assets/loading128px.gif'

// Also used for copy-paste for creating new components
class LoadingAnimation extends Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {}

        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={styles.centered}>
                <img src={loadingGif} alt={'Loading...'} />
            </div>
        )
    }
}

export default LoadingAnimation;