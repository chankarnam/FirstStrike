
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  id: string;
  type: 'Wildfire' | 'Flood' | 'Structural Fire' | 'Medical' | 'Hazmat';
  location: { lat: number; lng: number; address: string };
  severity: Severity;
  status: 'Reported' | 'Dispatched' | 'On-Scene' | 'Contained' | 'Resolved';
  timestamp: Date;
  description: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'Drone' | 'Fire Engine' | 'Ambulance' | 'Hazmat Unit' | 'Air Tanker';
  status: 'Available' | 'En-Route' | 'Active' | 'Maintenance';
  location: { lat: number; lng: number };
  capabilities: string[];
}

export interface AgentRecommendation {
  agentName: 'Planner' | 'Risk' | 'Logistics';
  action: string;
  reasoning: string;
  priority: number;
}

export interface CommandPlan {
  summary: string;
  nextSteps: string[];
  allocations: { resourceId: string; incidentId: string; task: string }[];
  risks: string[];
}
