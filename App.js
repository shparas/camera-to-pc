import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
	
	snap =  async () => {       
    console.log('Button Pressed');
    if (this.camera) {
       console.log('Taking photo');
       const options = { quality: 0, base64: true, fixOrientation: true, 
       exif: true};
       await this.camera.takePictureAsync(options).then(photo => {
          photo.exif.Orientation = 1;  
						console.log(this.camera.getAvailablePictureSizesAsync('4:3'));
					var photoObj = {
						base64: photo.base64,
						id: "test",  
						desc: "desc",
						type: 'image/jpeg',
						name: 'photo.jpg',
					};
					fetch('https://192.168.1.12/receive-raw-image', {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(photoObj),
					});
					
       });     
     }
    }
		
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ref=>{this.camera=ref}} style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Sw	itch{' '}
                </Text>
              </TouchableOpacity>
							<TouchableOpacity 
								style={{
									flex: 0.5,
									alignSelf: 'flex-end',
									alignItems: 'center',
									
								}}							
								onPress={this.snap.bind(this)}>
								<Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Shoot!{' '}
                </Text>
							</TouchableOpacity>	
            </View>
          </Camera>
        </View>
      );
    }
  }
}

