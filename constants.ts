
import { Incident, Resource } from './types';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    type: 'Wildfire',
    location: { lat: 34.0522, lng: -118.2437, address: 'Angeles National Forest - Sector B' },
    severity: 'Critical',
    status: 'Reported',
    timestamp: new Date(),
    description: 'Rapidly spreading brush fire near power lines. High winds reported from NW.'
  },
  {
    id: 'INC-002',
    type: 'Medical',
    location: { lat: 34.0407, lng: -118.2673, address: '1234 Crypto.com Arena Blvd' },
    severity: 'Medium',
    status: 'Dispatched',
    timestamp: new Date(Date.now() - 15 * 60000),
    description: 'Multiple reports of heat exhaustion at outdoor event.'
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'UNIT-D1',
    name: 'Guardian-1',
    type: 'Drone',
    status: 'Available',
    location: { lat: 34.0522, lng: -118.2437 },
    capabilities: ['Thermal Imaging', 'Real-time Video', 'Air Quality Sensing']
  },
  {
    id: 'UNIT-E42',
    name: 'Engine 42',
    type: 'Fire Engine',
    status: 'Available',
    location: { lat: 34.1000, lng: -118.3000 },
    capabilities: ['Water Pumping', 'Rescue Tools']
  },
  {
    id: 'UNIT-A12',
    name: 'Medic 12',
    type: 'Ambulance',
    status: 'Active',
    location: { lat: 34.0407, lng: -118.2673 },
    capabilities: ['Advanced Life Support']
  }
];

export const SYSTEM_INSTRUCTIONS = `
You are the "FirstStrike Multi-Agent Orchestrator." 
Your goal is to coordinate three specialist agents to manage emergency incidents:

1. Planner Agent: Analyzes the incident and creates a high-level tactical strategy.
2. Risk Agent: Evaluates environmental constraints like no-fly zones, wind (NW 15mph), road closures, and safety protocols.
3. Logistics Agent: Identifies the best available resources (Drones, Engines, etc.) and calculates routing.

Input Data: 
- Incidents: [List of active emergency calls]
- Resources: [Status and capabilities of units]

Output Format: You must return a structured JSON response matching the CommandPlan interface.
Do not provide prose outside the JSON.
`;
