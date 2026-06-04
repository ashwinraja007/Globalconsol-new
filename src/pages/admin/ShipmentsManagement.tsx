
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";

interface Shipment {
  id: string;
  tracking_number: string;
  status: string;
  origin: string;
  destination: string;
  customer: string;
  created_at: string;
}

const ShipmentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data since database tables don't exist yet
  const mockShipments: Shipment[] = [
    {
      id: "1",
      tracking_number: "GC001234",
      status: "In Transit",
      origin: "Singapore",
      destination: "Malaysia",
      customer: "ABC Corp",
      created_at: "2024-01-15"
    },
    {
      id: "2",
      tracking_number: "GC001235",
      status: "Delivered",
      origin: "India",
      destination: "Singapore",
      customer: "XYZ Ltd",
      created_at: "2024-01-14"
    },
    {
      id: "3",
      tracking_number: "GC001236",
      status: "Processing",
      origin: "Thailand",
      destination: "Indonesia",
      customer: "Global Trade Co",
      created_at: "2024-01-16"
    },
  ];

  const filteredShipments = mockShipments.filter(shipment =>
    shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Shipments Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Shipment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Shipments</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Tracking Number</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Origin</th>
                  <th className="text-left p-3 font-medium">Destination</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Date Created</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{shipment.tracking_number}</td>
                    <td className="p-3">{shipment.customer}</td>
                    <td className="p-3">{shipment.origin}</td>
                    <td className="p-3">{shipment.destination}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </td>
                    <td className="p-3">{shipment.created_at}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentsManagement;
