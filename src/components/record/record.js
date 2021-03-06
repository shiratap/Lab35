import React from "react";
import { connect } from "react-redux";

import Form from "react-jsonschema-form";
import superagent from "superagent";

import * as actions from "../../store/actions.js";

const uiSchema = {
  _id: { "ui:widget": "hidden" },
  __v: { "ui:widget": "hidden" }
};

class Record extends React.Component {
  constructor(props) {
    super(props);
    this.state = { schema: {} };
  }

  componentDidMount = () => {
    let url =
      "https://api-js401.herokuapp.com/api/v1/" + this.props.model + "/schema";
    superagent
      .get(url)
      .then(results => {
        this.setState({ schema: results.body });
      })
      .catch(console.log());
  };

  resetPlayer = id => {
    this.setState({ id: null });
  };

  handleSubmit = form => {
    let formData = form.formData;
    console.log(this.props.model);
    console.log(formData);
    this.props.handlePost({ model: this.props.model, record: formData });
  };

  render() {
    return (
      <div>
        <h3>Edit Record {this.props.id}</h3>
        <Form
          schema={this.state.schema}
          uiSchema={uiSchema}
          formData={this.props.records[this.props.model][this.props.id]}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  records: state.records
});

const mapDispatchToProps = (dispatch, getState) => ({
  handlePost: payload => dispatch(actions.postResource(payload)),
  handlePut: payload => dispatch(actions.put(payload)),
  handlePatch: payload => dispatch(actions.patch(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Record);
