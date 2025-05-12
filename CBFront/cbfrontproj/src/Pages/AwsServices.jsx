import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAccount as setEc2Account, fetchEc2Data } from '../redux/slices/ec2Slice';
import { setSelectedAccount as setRdsAccount, fetchRdsData } from '../redux/slices/rdsSlice';
import {
  setSelectedAccount as setAsgAccount,
  fetchAsgData
} from '../redux/slices/asgSlice';
import AccountDropdown from '../components/AccountDropdown';

const AwsServices = () => {
  const dispatch = useDispatch();
  const [activeService, setActiveService] = useState('EC2');
  const [selectedAccountId, setSelectedAccountId] = useState(''); // Unified account state

  // EC2
  const ec2Data = useSelector((state) => state.ec2.ec2Data);
  const ec2Loading = useSelector((state) => state.ec2.loading);
  const [ec2HasFetched, setEc2HasFetched] = useState(false);

  // RDS
  const rdsData = useSelector((state) => state.rds.rdsData);
  const rdsLoading = useSelector((state) => state.rds.loading);
  const [rdsHasFetched, setRdsHasFetched] = useState(false);

  // ASG
  const asgData = useSelector((state) => state.asg.asgData);
  const asgLoading = useSelector((state) => state.asg.loading);
  const [asgHasFetched, setAsgHasFetched] = useState(false);

  const loading =
    activeService === 'EC2' ? ec2Loading :
    activeService === 'RDS' ? rdsLoading :
    activeService === 'ASG' ? asgLoading : false;

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Add some visual feedback
        alert('Resource ID copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  // Format long resource IDs (like ARNs)
  const formatResourceId = (id) => {
    if (id.startsWith('arn:aws:autoscaling')) {
      const parts = id.split(':');
      return `arn:aws:autoscaling.../${parts[parts.length - 1]}`;
    }
    return id;
  };
  
  useEffect(() => {
    if (!selectedAccountId) return;

    // Dispatch the selected account to the appropriate service slice
    if (activeService === 'EC2') {
      dispatch(setEc2Account(selectedAccountId));
      setEc2HasFetched(false);
      dispatch(fetchEc2Data(selectedAccountId))
        .then(() => setEc2HasFetched(true))
        .catch(() => setEc2HasFetched(true));
    } else if (activeService === 'RDS') {
      dispatch(setRdsAccount(selectedAccountId));
      setRdsHasFetched(false);
      dispatch(fetchRdsData(selectedAccountId))
        .then(() => setRdsHasFetched(true))
        .catch(() => setRdsHasFetched(true));
    } else if (activeService === 'ASG') {
      dispatch(setAsgAccount(selectedAccountId));
      setAsgHasFetched(false);
      dispatch(fetchAsgData(selectedAccountId))
        .then(() => setAsgHasFetched(true))
        .catch(() => setAsgHasFetched(true));
    }
  }, [activeService, selectedAccountId, dispatch]);

  const handleServiceChange = (service) => {
    setActiveService(service);
  };

  return (
    <div className="max-w-full mx-auto px-4">
      <div className="rounded-lg shadow border border-gray-200 bg-white mx-auto">
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Services</h1>
            <div className="flex space-x-2">
              {['EC2', 'RDS', 'ASG'].map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceChange(service)}
                  className={`px-6 py-2 font-bold text-sm uppercase tracking-wide focus:outline-none rounded-md ${
                    activeService === service
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <AccountDropdown
            selectedAccountId={selectedAccountId}
            onSelect={setSelectedAccountId}
          />
        </div>

        <div className="overflow-x-auto">
          <div className="w-full p-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Resources</h1>
              {['EC2', 'RDS', 'ASG'].includes(activeService) && !selectedAccountId && (
                <p className="text-gray-500 text-sm">Please select an account to view resources</p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="min-h-[600px] max-h-[600px] overflow-y-auto">
                {activeService === 'EC2' && selectedAccountId && ec2HasFetched && (
                  ec2Data.length > 0 ? (
                    <table className="w-full table-fixed">
                      <thead className="bg-blue-100 text-blue-800 font-semibold uppercase text-sm">
                        <tr>
                          <th className="px-4 py-3 text-left w-1/4">Resource ID</th>
                          <th className="px-4 py-3 text-left w-1/4">Name</th>
                          <th className="px-4 py-3 text-left w-1/4">Status</th>
                          <th className="px-4 py-3 text-left w-1/4">Region</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ec2Data.map((instance, index) => (
                          <tr
                            key={instance.resourceId}
                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-4 py-3 flex items-center">
                              <span className="mr-2">{instance.resourceId}</span>
                              <button 
                                onClick={() => copyToClipboard(instance.resourceId)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              </button>
                            </td>
                            <td className="px-4 py-3">{instance.resourceName}</td>
                            <td className="px-4 py-3">{instance.status}</td>
                            <td className="px-4 py-3">{instance.region}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 text-sm">No EC2 resources found for this account.</p>
                  )
                )}

                {activeService === 'RDS' && selectedAccountId && rdsHasFetched && (
                  rdsData.length > 0 ? (
                    <table className="w-full table-fixed">
                      <thead className="bg-blue-100 text-blue-800 font-semibold uppercase text-sm">
                        <tr>
                          <th className="px-4 py-3 text-left w-1/5">Resource ID</th>
                          <th className="px-4 py-3 text-left w-1/5">Name</th>
                          <th className="px-4 py-3 text-left w-1/5">Engine</th>
                          <th className="px-4 py-3 text-left w-1/5">Status</th>
                          <th className="px-4 py-3 text-left w-1/5">Region</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rdsData.map((instance, index) => (
                          <tr
                            key={instance.resourceId}
                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-4 py-3 flex items-center">
                              <span className="mr-2">{instance.resourceId}</span>
                              <button 
                                onClick={() => copyToClipboard(instance.resourceId)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              </button>
                            </td>
                            <td className="px-4 py-3">{instance.resourceName}</td>
                            <td className="px-4 py-3">{instance.engine}</td>
                            <td className="px-4 py-3">{instance.status}</td>
                            <td className="px-4 py-3">{instance.region}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 text-sm">No RDS resources found for this account.</p>
                  )
                )}

                {activeService === 'ASG' && selectedAccountId && asgHasFetched && (
                  asgData.length > 0 ? (
                    <table className="w-full table-fixed">
                      <thead className="bg-blue-100 text-blue-800 font-semibold uppercase text-sm">
                        <tr>
                          <th className="px-4 py-3 text-left w-1/7">Resource ID</th>
                          <th className="px-4 py-3 text-left w-1/7">Resource Name</th>
                          <th className="px-4 py-3 text-left w-1/7">Region</th>
                          <th className="px-4 py-3 text-left w-1/7">Desired Capacity</th>
                          <th className="px-4 py-3 text-left w-1/7">Min Size</th>
                          <th className="px-4 py-3 text-left w-1/7">Max Size</th>
                          <th className="px-4 py-3 text-left w-1/7">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {asgData.map((instance, index) => (
                          <tr
                            key={instance.resourceId}
                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="truncate mr-2">{formatResourceId(instance.resourceId)}</span>
                                <button 
                                  onClick={() => copyToClipboard(instance.resourceId)}
                                  className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                  title="Copy full resource ID"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3">{instance.resourceName}</td>
                            <td className="px-4 py-3">{instance.region}</td>
                            <td className="px-4 py-3">{instance.desiredCapacity}</td>
                            <td className="px-4 py-3">{instance.minSize}</td>
                            <td className="px-4 py-3">{instance.maxSize}</td>
                            <td className="px-4 py-3">{instance.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 text-sm">No ASG resources found for this account.</p>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwsServices;