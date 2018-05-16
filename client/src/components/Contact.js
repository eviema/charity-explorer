import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem,} from 'mdbreact';
import ScrollUpButton from 'react-scroll-up-button';
import contactBg from '../assets/contactBg.png';

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            message: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name,
            value = event.target.value;
        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        alert('Your favorite flavor is: ');
        event.preventDefault();
    }

    render() {

        const contactBgStyle = {
            minHeight:"90vh",
            width: "100vw",
            backgroundImage: `url(${contactBg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundAttachment: "scroll",
            backgroundPosition: "bottom",
            position: "relative",
        };

        const contactBgOverlayStyle = {
            position: "absolute", 
            width: "100%", 
            height: "100%", 
            top: "0", 
            left: "0", 
            right: "0", 
            bottom: "0", 
            background: "linear-gradient(141deg, #0277BD, #00838F)",
            opacity: ".5",
            zIndex: "2", 
        };

        return(
            <div style={{background: "#F3F3F3", width:"100%"}}>
                <ScrollUpButton />
                <Breadcrumb className="small mb-0">
                    <BreadcrumbItem><a href="/"><i className="fa fa-home"></i></a></BreadcrumbItem>
                    <BreadcrumbItem active>Contact us</BreadcrumbItem>
                </Breadcrumb>

                <div className="row d-flex justify-content-center align-items-center px-2 m-0" style={contactBgStyle}>   

                    <div style={contactBgOverlayStyle}></div>
                    <div className="row col col-12 d-flex justify-content-center align-items-start p-4" style={{zIndex:"3"}}>                 
                        {/* contact details */}
                        <div className="col col-12 col-md-4 d-flex flex-column align-items-center justify-content-center z-depth-1 p-4" style={{background:"#0D47A1"}}>
                            <h4 className="text-white text-center mb-4">Contact Us</h4>
                            <div style={{color:"#E0E0E0"}}>
                                <p>
                                    <i className="far fa-user mr-3"></i>
                                    <span>ACE Solutions</span>
                                </p>
                                <p className="d-flex">
                                    <i className="fa fa-map-pin mr-4"></i>
                                    <span>
                                        <span>900 Dandenong Road</span> <br />
                                        <span>Caulfield East VIC 3145</span> <br />
                                        <span>Australia</span>
                                    </span>
                                </p>
                                <p>
                                    <i className="far fa-envelope mr-3"></i>
                                    <span>donatenowlocally@gmail.com</span>
                                </p>
                            </div>
                        </div>

                        {/* contact form */}
                        <div className="col col-12 col-md-5 z-depth-1 p-4" style={{background:"#fff"}}>
                            <div className="text-center">
                                <h4>Get in touch</h4>
                                <h6 style={{color:"#616161"}}>Feel free to drop us a line below!</h6>
                            </div>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name" className="mb-0 py-1 px-3" style={{background: "#00BCD4", color: "#fff", borderRadius: "10px 10px 0 0"}}>
                                        <i className="fa fa-user"></i>
                                    </label>
                                    <input type="text" name="name" value={this.state.name} id="name" 
                                        onChange={this.handleChange} className="form-control"  
                                        placeholder="Your name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="mb-0 py-1 px-3" style={{background: "#00BCD4", color: "#fff", borderRadius: "10px 10px 0 0"}}>
                                        <i className="fa fa-envelope"></i>
                                    </label>
                                    <input type="email" name="email" value={this.state.email} id="email" 
                                        onChange={this.handleChange} className="form-control" 
                                        placeholder="Your email address" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message" className="mb-0 py-1 px-3" style={{background: "#00BCD4", color: "#fff", borderRadius: "10px 10px 0 0"}}>
                                        <i className="fa fa-pencil-alt"></i>
                                    </label>
                                    <textarea name="message" value={this.state.message} id="message"
                                    onChange={this.handleChange} className="form-control" rows="3"
                                    placeholder="Your message"></textarea>
                                </div>
                                <button className="btn btn-primary" onClick={this.handleSubmit}>
                                    Send <i className="far fa-paper-plane ml-1"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            
            </div>
        );
    }

}

export default Contact;