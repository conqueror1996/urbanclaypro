
export const EMAIL_STYLES = {
    container: `
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
        max-width: 600px; 
        margin: 0 auto; 
        background-color: #ffffff;
        border: 1px solid #e9e2da;
        border-radius: 16px;
        overflow: hidden;
    `,
    header: `
        text-align: center; 
        padding: 40px 20px; 
        background-color: #f8f7f6;
        border-bottom: 1px solid #e9e2da;
    `,
    body: `
        padding: 40px 30px;
        color: #2A1E16;
        font-size: 16px;
        line-height: 1.6;
    `,
    footer: `
        background-color: #2A1E16;
        padding: 40px 30px;
        text-align: center;
        color: rgba(255,255,255,0.6);
        font-size: 12px;
    `,
    button: `
        display: inline-block;
        background-color: #b45a3c;
        color: #ffffff;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 14px;
        margin-top: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
    `,
    highlightBox: `
        background-color: #f8f7f6;
        padding: 24px;
        border-radius: 12px;
        margin: 24px 0;
        border: 1px solid #e9e2da;
    `
};

export const EMAIL_SIGNATURE = `
    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e9e2da;">
        <table style="width: 100%;">
            <tr>
                <td style="width: 60px; vertical-align: top;">
                    <img src="https://raw.githubusercontent.com/conqueror1996/urbanclaypro/main/public/urbanclay-logo.png" alt="UrbanClay" width="48" height="48" style="background-color: #f8f7f6; border-radius: 8px; padding: 4px;" />
                </td>
                <td style="vertical-align: top;">
                    <p style="margin: 0; font-weight: bold; color: #b45a3c; font-size: 16px;">UrbanClay Team</p>
                    <p style="margin: 4px 0 0; color: #5d554f; font-size: 14px;">Premium Terracotta Solutions</p>
                    <p style="margin: 8px 0 0; font-size: 13px;">
                        <a href="https://claytile.in" style="color: #2A1E16; text-decoration: none; font-weight: bold;">claytile.in</a> • 
                        <a href="mailto:urbanclay@claytile.in" style="color: #2A1E16; text-decoration: none; font-weight: bold;">urbanclay@claytile.in</a> • 
                        <a href="tel:+918080081951" style="color: #2A1E16; text-decoration: none;">+91 80800 81951</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
`;

export const EMAIL_FOOTER = `
    <div style="${EMAIL_STYLES.footer}">
        <div style="margin-bottom: 20px;">
            <span style="color: white; font-size: 24px; font-weight: bold; font-family: serif;">UrbanClay</span>
        </div>
        <p style="margin-bottom: 10px;">
            Crafting timeless spaces with authentic terracotta.
        </p>
        <p>
            Mumbai • Pune • Delhi • Bangalore
        </p>
        <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <a href="https://www.instagram.com/urbanclay.in/" style="color: white; text-decoration: none; margin: 0 10px;">Instagram</a>
            <a href="https://claytile.in/products" style="color: white; text-decoration: none; margin: 0 10px;">Catalog</a>
            <a href="https://wa.me/918080081951" style="color: white; text-decoration: none; margin: 0 10px;">WhatsApp</a>
        </div>
    </div>
`;
