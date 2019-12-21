import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "semantic-ui-react";

const AnyReactComponent = () => <Icon name="marker" size="big" color="red" />;

class SimpleMap extends Component {
  static defaultProps = {
    zoom: 11
  };

  render() {
    const { latitlong } = this.props;
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyC94LBIVLGElrWNXhkFYB6igA9GUEIfvyk" }}
          defaultCenter={latitlong}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={latitlong.lat} lng={latitlong.lng} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
