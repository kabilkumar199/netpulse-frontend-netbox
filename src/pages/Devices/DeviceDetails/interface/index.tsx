import InterfaceView from "./InterfaceView"


function InterfaceTab() {
  const handleRefresh = () => {
    // This would typically fetch new data from an API
    console.log('Refreshing interface data...')
  }

  return <InterfaceView data={''} onRefresh={handleRefresh} />
}

export default InterfaceTab

