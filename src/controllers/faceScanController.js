const FaceScanModel = require('../models/facescan.model');

class FaceScanController {
    static async scanFace(req, res) {
        try {
            const { imageData, userId } = req.body;
            // It gives 400 error if the imageData is empty
            if (!imageData || imageData.trim().length === 0) {
                return res.status(400).json({ success: false, message: 'Image data is required' });
            }

            
            const newFaceScan = await FaceScanModel.create({
                userId,
                imageData,
            });

            
            const timestamp = new Date();
            return res.status(200).json({
                success: true,
                message: 'Face scan completed successfully',
                data: {
                    userId,
                    imageData,
                    timestamp
                }
            });
        } catch (error) {
            console.error('Error scanning face:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = FaceScanController;
