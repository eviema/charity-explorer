import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Input, Button, Fa } from 'mdbreact';

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sendClicked: false
        };
        this.handleOnClickToSend = this.handleOnClickToSend.bind(this);
    }

    handleOnClickToSend() {
        this.setState({
            sendClicked: true
        });
    }

    render() {
        return(
            <div>
    
                <Breadcrumb>
                    <BreadcrumbItem><a href="/home"><i class="fa fa-home fa-lg"></i></a></BreadcrumbItem>
                    <BreadcrumbItem active>Contact us</BreadcrumbItem>
                </Breadcrumb>
                
                <form className="mx-5 px-5 py-5">
                    <p>If you have any questions or concerns, feel free to drop us an email.</p>
                    <p>We'd love to hear from you!</p>
                    <p className="h5 text-center my-4">Write to us</p>
                    <Input label="Your name" icon="user" group type="email" validate error="wrong" success="right"/>
                    <Input label="Your email" icon="envelope" group type="email" validate error="wrong" success="right"/>
                    <Input label="Subject" icon="tag" group type="email" validate error="wrong" success="right"/>
                    <Input type="textarea" label="Your message" icon="pencil"/>
                    <div className="text-center">
                        <Button color="#01579b light-blue darken-4" onClick={this.handleOnClickToSend}>
                            Send 
                            <Fa icon="paper-plane-o" className="ml-1"/>
                        </Button>
                        {
                            this.state.sendClicked &&
                            <p className="mt-4">
                                Thank you for contacting us. 
                                We'll get back to you as soon as we can!
                            </p>
                        }
                    </div>
                </form>
    
            </div>
        );
    }

}

export default Contact;