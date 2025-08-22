// Test script to verify schedule update functionality
// This is a simple test to check the logic flow

const testScheduleUpdate = () => {
  console.log('Testing schedule update logic...');
  
  // Mock current schedule
  const currentSchedule = {
    _id: 'schedule123',
    services: [
      { service: 'service1', status: 'pending' },
      { service: 'service2', status: 'completed' }
    ],
    payments: {
      payments: ['payment1', 'payment2'],
      totalPrice: 100,
      totalPaid: 50
    }
  };
  
  // Mock new services being added
  const newServices = ['service1', 'service2', 'service3', 'service4']; // service3 and service4 are new
  
  // Get current service IDs
  const currentServiceIds = currentSchedule.services.map(s => s.service);
  console.log('Current service IDs:', currentServiceIds);
  
  // Find newly added services
  const addedServiceIds = newServices.filter(serviceId => !currentServiceIds.includes(serviceId));
  console.log('Added service IDs:', addedServiceIds);
  
  // Update services list
  const updatedServices = [
    ...currentSchedule.services,
    ...addedServiceIds.map(serviceId => ({
      service: serviceId,
      status: 'pending'
    }))
  ];
  console.log('Updated services:', updatedServices);
  
  // Mock additional price calculation
  const additionalPrice = addedServiceIds.length * 25; // Assume each service costs 25
  console.log('Additional price:', additionalPrice);
  
  // Update payment info
  const updatedPaymentInfo = {
    payments: [...currentSchedule.payments.payments, 'payment3', 'payment4'], // Mock new payment IDs
    totalPrice: currentSchedule.payments.totalPrice + additionalPrice,
    totalPaid: currentSchedule.payments.totalPaid
  };
  console.log('Updated payment info:', updatedPaymentInfo);
  
  console.log('Test completed successfully!');
};

testScheduleUpdate();
