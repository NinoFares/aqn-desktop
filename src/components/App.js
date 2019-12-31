import React, { Component } from 'react'
import { watch } from 'fs';
import { Card, Typography, Progress, Slider, Alert } from 'antd';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const { Meta } = Card;
const { Title, Text } = Typography;

import '../assets/css/App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: require('/home/pi/Desktop/result.json'),
      hist: require('/home/pi/Desktop/result.hist.json'),
      tempSlider: 0,
      humSlider: 0,
      co2Slider: 0,
      covSlider: 0,
      coolMode: false
    }

    this.tempSliderChanged = this.tempSliderChanged.bind(this)
    this.humSliderChanged = this.humSliderChanged.bind(this)
    this.co2SliderChanged = this.co2SliderChanged.bind(this)
    this.covSliderChanged = this.covSliderChanged.bind(this)
    this.bannerClose = this.bannerClose.bind(this);
  }

  componentDidMount() {
    watch('/home/pi/Desktop/result.json', (event, filename) => {
      if (filename) {
        this.setState({data: require('/home/pi/Desktop/result.json')})
      }
    });

    setInterval(() => {
      const { tempSlider, humSlider, co2Slider, covSlider } = this.state;
      const { temp, humid, co2, cov } = this.state.data;
      if(tempSlider && humSlider && co2Slider && covSlider) {
        if(tempSlider < temp || humSlider < humid || co2Slider < co2 || covSlider < cov) {
          this.setState({coolMode: true});
        }
      }
    }, 10000);

    setInterval(() => {
      this.setState({hist: require('/home/pi/Desktop/result.hist.json')});
    }, 60000 * 10);
  }

  tempSliderChanged(val) { this.setState({tempSlider: val}) }
  humSliderChanged(val) { this.setState({humSlider: val}) }
  co2SliderChanged(val) { this.setState({co2Slider: val}) }
  covSliderChanged(val) { this.setState({covSlider: val}) }

  bannerClose() { this.setState({coolMode: false}); }

  render() {

    const data = this.state.hist;


    return (
      <div>
        {this.state.coolMode ? <Alert onClose={this.bannerClose} message="Seuil dépassé, ventilateur mis en route..." banner closable /> : null}
        <div className="cards-container">
          <Card style={{ width: 300, marginTop: 16 }} actions={[<Slider defaultValue={0} min={0} max={50} onAfterChange={this.tempSliderChanged}/>, <ResponsiveContainer width="100%" height={100}><LineChart data={data}><Tooltip/><Line type='monotone' dataKey='temp' stroke='#8884d8' strokeWidth={2} /></LineChart></ResponsiveContainer>]}>
            <Meta title={<Text>Température</Text>} />
            <Progress style={{marginTop: '25px'}} type="dashboard" percent={100} status="normal" format={percent => <Title level={4}>{this.state.data.temp}°C</Title>}/>
          </Card>
          <Card style={{ width: 300, marginTop: 16 }} actions={[<Slider defaultValue={0} min={20} max={80} onAfterChange={this.humSliderChanged}/>, <ResponsiveContainer width="100%" height={100}><LineChart data={data}><Tooltip/><Line type='monotone' dataKey='humid' stroke='#8884d8' strokeWidth={2} /></LineChart></ResponsiveContainer>]}>
            <Meta title={<Text>Humidité</Text>} />
            <Progress style={{marginTop: '25px'}} type="dashboard" percent={100} status="normal" format={percent => <Title level={4}>{this.state.data.humid}%</Title>}/>
          </Card>
          <Card style={{ width: 300, marginTop: 16 }} actions={[<Slider defaultValue={0} min={450} max={2000} onAfterChange={this.co2SliderChanged}/>, <ResponsiveContainer width="100%" height={100}><LineChart data={data}><Tooltip/><Line type='monotone' dataKey='co2' stroke='#8884d8' strokeWidth={2} /></LineChart></ResponsiveContainer>]}>
            <Meta title={<Text>CO2</Text>} />
            <Progress style={{marginTop: '25px'}} type="dashboard" percent={100} status="normal" format={percent => <Title level={4}>{this.state.data.co2}ppm</Title>}/>
          </Card>
          <Card style={{ width: 300, marginTop: 16 }} actions={[<Slider defaultValue={0} min={125} max={600} onAfterChange={this.covSliderChanged}/>, <ResponsiveContainer width="100%" height={100}><LineChart data={data}><Tooltip/><Line type='monotone' dataKey='cov' stroke='#8884d8' strokeWidth={2} /></LineChart></ResponsiveContainer>]}>
            <Meta title={<Text>COV</Text>} />
            <Progress style={{marginTop: '25px'}} type="dashboard" percent={100} status="normal" format={percent => <Title level={4}>{this.state.data.cov}µg/m3</Title>}/>
          </Card>
        </div>
      </div>
    )
  }
}

export default App