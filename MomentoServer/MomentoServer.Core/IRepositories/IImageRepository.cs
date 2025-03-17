using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IRepositories
{
    public interface IImageRepository
    {
        Task<bool> AddImageAsync(Image image);
        Task<Image?> GetImageByIdAsync(int id);
        Task<List<Image>> GetAllImagesAsync(int userId);
        Task UpdateImageAsync(Image image);
        Task DeleteImageAsync(Image image);
        //Task DeleteImageByIdAsync(Image image);



    }
}
