using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;

namespace MementoServer.Data.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ImageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddImageAsync(Image image)
        {
            await _context.Images.AddAsync(image);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Image?> GetImageByIdAsync(int id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task<List<Image>> GetAllImagesAsync(int userId)
        {
            return await _context.Images.Where(img => img.UserId == userId).ToListAsync();
        }
        public async Task<List<Image>> GetAllImagesCalendarAsync(List<Image>IdImages, int numOfCalendar)
        {
            return  IdImages.Where(img => img.NumOfCalendar == numOfCalendar).ToList();
        }

        public async Task<bool> UpdateImageAsync(int id,Image image)
        {

            var imgForUpdate = _context.Images.Where(img => img.Id == id).ToList();
            var img = imgForUpdate.Find(img => img.NumOfCalendar == image.NumOfCalendar);
            if (img != null)
            {
                img.Event = image.Event;
                img.Url = image.Url;
                img.EventDate = image.EventDate;
                img.UserId = image.UserId;
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
           
        }

        public async Task<bool> DeleteImageAsync(Image image)
        {

            var user = await _context.Images.FindAsync(image.Id);
            if (user != null)
            {
                _context.Images.Remove(image);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        
    }
}
