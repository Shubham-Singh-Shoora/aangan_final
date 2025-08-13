
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, FileText, CheckCircle, Zap, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { useICP } from '@/contexts/ICPContext';
import { PropertyService } from '@/services/PropertyService';
import { RentalService } from '@/services/RentalService';

const RentalAgreement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { actor, user } = useICP();
  const [agreed, setAgreed] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [approvedRental, setApprovedRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyDetails();
    checkApprovedRental();
  }, [id, actor]);

  const fetchPropertyDetails = async () => {
    if (!actor || !id) return;

    try {
      setLoading(true);
      const propertyService = new PropertyService(actor);
      const propertyData = await propertyService.getPropertyById(parseInt(id));
      setProperty(propertyData);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const checkApprovedRental = async () => {
    if (!actor || !id) return;

    try {
      const rentalService = new RentalService(actor);
      const approvedRentals = await rentalService.getApprovedRentals();
      
      // Check if there's an approved rental for this property
      const rental = approvedRentals.find((r: any) => r.property_id === parseInt(id));
      
      if (rental) {
        setApprovedRental(rental);
      } else {
        toast.error('No approved rental found for this property. Please get landlord approval first.');
        navigate('/tenant-dashboard');
      }
    } catch (error) {
      console.error('Error checking approved rental:', error);
      // Allow to proceed if service is not available yet
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow">
              <FileText className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Agreement...</h2>
            <p className="text-gray-600">Please wait while we prepare your rental agreement</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed</p>
            <Button onClick={() => navigate('/marketplace')} className="btn-futuristic">
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const agreementData = {
    propertyTitle: property.title,
    propertyAddress: property.address,
    landlordName: 'Property Owner', // This should come from landlord's profile
    tenantName: user?.name || 'Current User',
    monthlyRent: approvedRental ? Number(approvedRental.rent_amount) : Number(property.rent_amount),
    securityDeposit: approvedRental ? Number(approvedRental.deposit_amount) : Number(property.deposit_amount),
    leaseStartDate: approvedRental ? new Date(Number(approvedRental.start_date) / 1000000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    leaseEndDate: approvedRental ? new Date(Number(approvedRental.end_date) / 1000000).toISOString().split('T')[0] : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    agreementDate: new Date().toISOString().split('T')[0]
  };

  const handleConfirmAndMint = async () => {
    if (!agreed) {
      toast.error('Please read and agree to the terms and conditions');
      return;
    }

    if (!actor || !property || !user || !approvedRental) {
      toast.error('Please ensure you are logged in and have an approved rental');
      return;
    }

    setIsMinting(true);

    try {
      const rentalService = new RentalService(actor);

      // Confirm the approved rental (this will mint the NFT)
      const rental = await rentalService.confirmRental(approvedRental.id);

      toast.success('Rental agreement created successfully!');
      navigate('/success', {
        state: {
          type: 'rental',
          rentalId: rental.id,
          propertyTitle: agreementData.propertyTitle
        }
      });
    } catch (error) {
      console.error('Error creating rental:', error);
      toast.error('Failed to create rental agreement. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const agreementText = `
भारतीय किराया समझौता / INDIAN RENTAL AGREEMENT

यह किराया समझौता ("Agreement") ${new Date(agreementData.agreementDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} को निम्नलिखित पक्षों के बीच किया जा रहा है:

मकान मालिक / LANDLORD: ${agreementData.landlordName}
किरायेदार / TENANT: ${agreementData.tenantName}

संपत्ति विवरण / PROPERTY DETAILS:
संपत्ति / Property: ${agreementData.propertyTitle}
पता / Address: ${agreementData.propertyAddress}

नियम और शर्तें / TERMS AND CONDITIONS:

1. किराया अवधि / LEASE PERIOD
किराया अवधि ${new Date(agreementData.leaseStartDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} से शुरू होकर ${new Date(agreementData.leaseEndDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} तक चलेगी।

2. किराया / RENT
संपत्ति का मासिक किराया ₹${agreementData.monthlyRent.toLocaleString('en-IN')} है, जो हर महीने की 5 तारीख से पहले अग्रिम में देय होगा।

3. जमानत राशि / SECURITY DEPOSIT
किरायेदार ने ₹${agreementData.securityDeposit.toLocaleString('en-IN')} की सुरक्षा जमा राशि का भुगतान किया है जो किरायेदारी की समाप्ति पर किसी भी नुकसान या बकाया देय राशि की कटौती के अधीन वापस की जाएगी।

4. संपत्ति का उपयोग / USE OF PROPERTY
संपत्ति का उपयोग केवल आवासीय उद्देश्यों के लिए किया जाएगा और मकान मालिक की पूर्व लिखित सहमति के बिना किसी भी व्यावसायिक गतिविधियों के लिए उपयोग नहीं किया जाएगा।

5. रखरखाव और मरम्मत / MAINTENANCE AND REPAIRS
किरायेदार संपत्ति को अच्छी स्थिति में बनाए रखेगा और छोटी मरम्मत और रखरखाव के लिए जिम्मेदार होगा। बड़ी मरम्मत मकान मालिक की जिम्मेदारी होगी।

6. समाप्ति / TERMINATION
कोई भी पक्ष दूसरे पक्ष को एक महीने का लिखित नोटिस देकर इस समझौते को समाप्त कर सकता है।

7. NFT सत्यापन / NFT VERIFICATION
यह किराया समझौता ब्लॉकचेन तकनीक द्वारा सुरक्षित है और सत्यापन और पारदर्शिता के उद्देश्यों के लिए एक गैर-फंजिबल टोकन (NFT) के रूप में प्रतिनिधित्व किया गया है।

8. शासी कानून / GOVERNING LAW
यह समझौता भारत के कानूनों द्वारा शासित होगा और किसी भी विवाद के लिए मुंबई, महाराष्ट्र की अदालतों का न्यायाधिकार होगा।

इस समझौते पर हस्ताक्षर करके, दोनों पक्ष स्वीकार करते हैं कि उन्होंने इसमें बताई गई सभी नियमों और शर्तों को पढ़ा, समझा और मानने के लिए सहमत हैं।

मकान मालिक हस्ताक्षर / LANDLORD SIGNATURE: _________________    दिनांक / DATE: _________________
${agreementData.landlordName}

किरायेदार हस्ताक्षर / TENANT SIGNATURE: _________________      दिनांक / DATE: _________________
${agreementData.tenantName}

यह समझौता डिजिटल रूप से हस्ताक्षरित है और ब्लॉकचेन तकनीक द्वारा सुरक्षित है।

--- ENGLISH VERSION ---

This agreement is digitally signed and secured by blockchain technology for verification and legal compliance under Indian rental laws including the Model Tenancy Act, 2021.
  `;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 glass-card"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mr-4 pulse-glow">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Rental Agreement
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Review and confirm your rental agreement before NFT minting
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Agreement Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agreement Summary */}
            <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Agreement Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                      Property
                    </p>
                    <p className="font-bold text-lg text-gray-900">{agreementData.propertyTitle}</p>
                    <p className="text-sm text-gray-600">{agreementData.propertyAddress}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1 text-blue-500" />
                        Monthly Rent
                      </p>
                      <p className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        ₹{agreementData.monthlyRent.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Security Deposit</p>
                      <p className="font-bold text-lg text-gray-900">
                        ₹{agreementData.securityDeposit.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-blue-100">
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                      Lease Start Date
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(agreementData.leaseStartDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                      Lease End Date
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(agreementData.leaseEndDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Agreement Text */}
            <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-white to-blue-50/30">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Complete Rental Agreement</CardTitle>
                <p className="text-sm text-gray-600">Please read the complete agreement carefully (Available in Hindi & English)</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full rounded-xl border border-blue-200 p-6 bg-gradient-to-br from-blue-50/50 to-white glass-card">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {agreementText}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Agreement Checkbox */}
            <Card className="card-futuristic border-blue-200 bg-gradient-to-r from-blue-50/80 to-cyan-50/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="agreement"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                    className="border-blue-300 data-[state=checked]:bg-blue-600 mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="agreement"
                      className="text-base font-semibold text-gray-900 cursor-pointer"
                    >
                      I have read and agree to all terms and conditions
                    </Label>
                    <p className="text-sm text-gray-600 mt-2">
                      By checking this box, you acknowledge that you have thoroughly read the rental agreement
                      in both Hindi and English and agree to be legally bound by all its terms and conditions
                      as per Indian rental laws.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - NFT Information and Actions */}
          <div className="space-y-6">
            {/* NFT Minting Info */}
            <Card className="card-futuristic border-blue-200 bg-gradient-to-br from-blue-50/80 to-white sticky top-8 hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  NFT Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium">Blockchain secured agreement</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium">Immutable rental record</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium">Transparent ownership proof</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium">Legal compliance assured</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-2">What happens after confirmation?</p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Rental NFT will be minted on blockchain</li>
                    <li>• Agreement becomes legally verifiable</li>
                    <li>• You receive unique NFT identifier</li>
                    <li>• Property access is digitally granted</li>
                  </ul>
                </div>

                <Button
                  onClick={handleConfirmAndMint}
                  disabled={!agreed || isMinting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {isMinting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Minting NFT...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Confirm & Mint NFT
                    </div>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 glass-card"
                  disabled={isMinting}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="card-futuristic border-amber-200 bg-gradient-to-br from-amber-50/80 to-white">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Security Notice</p>
                    <p className="text-xs text-amber-700 mt-1">
                      This agreement will be permanently recorded on the blockchain as per
                      Indian digital signature laws. Please ensure all details are correct before proceeding.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAgreement;
